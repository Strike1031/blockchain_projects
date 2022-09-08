const { get } = require('lodash')
const { cachedAxios } = require('../db/models/cache')
const { CHAIN_TYPES, BALANCER_SUBGRAPH_URLS } = require('../constants')
const { balancerVault, token: tokenContract } = require('../web3/contracts')
const { getWeb3 } = require('../web3')
const { getTokenPrice } = require('../../prices')
const BigNumber = require('bignumber.js')

const executeBalancerCall = (type, query, networkId) => {
  let subgraphURL
  if (networkId == CHAIN_TYPES.ETH) {
    subgraphURL = BALANCER_SUBGRAPH_URLS.ETH
  } else if (networkId == CHAIN_TYPES.MATIC) {
    subgraphURL = BALANCER_SUBGRAPH_URLS.MATIC
  }
  return cachedAxios
    .post(subgraphURL, JSON.stringify({ query }))
    .then(response => {
      const data = get(response, `data.data.${type}`)
      if (data) {
        return data
      } else {
        console.error(get(response, 'data.errors', response))
        return null
      }
    })
    .catch(error => {
      console.error(`Balancer subgraph (${query}) failed:`, error)
      return null
    })
}

const getPoolInfo = async (poolId, networkId) => {
  if (networkId == CHAIN_TYPES.ETH) {
    return getPoolInfoSubgraph(poolId, networkId)
  } else if (networkId == CHAIN_TYPES.MATIC) {
    return getPoolInfoOnChain(poolId, networkId)
  }
}

const getPoolInfoSubgraph = (poolId, networkId) => {
  const query = `query {
    pools (where: {id: "${poolId}"}) { swapFee totalLiquidity }
  }`
  let result = executeBalancerCall('pools[0]', query, networkId)
  return result
}

const getPoolInfoOnChain = async (poolId, networkId) => {
  const {
    methods: { getPoolTokens },
    contract: {
      abi,
      address: { mainnet },
    },
  } = balancerVault

  const web3Instance = getWeb3(networkId)
  const balancerVaultInstance = new web3Instance.eth.Contract(abi, mainnet)

  const tokenInfo = await getPoolTokens(poolId, balancerVaultInstance)
  let totalValue = new BigNumber(0)
  for (let i = 0; i < tokenInfo.tokens.length; i++) {
    const token = tokenInfo.tokens[i]
    const tokenInstance = new web3Instance.eth.Contract(tokenContract.contract.abi, token)
    const tokenDecimals = await tokenContract.methods.getDecimals(tokenInstance)
    const amount = new BigNumber(tokenInfo.balances[i]).div(10 ** tokenDecimals)
    const tokenPrice = await getTokenPrice(token, networkId)
    const tokenValue = amount.times(tokenPrice)
    totalValue = totalValue.plus(tokenValue)
  }
  return { totalLiquidity: totalValue.toFixed() }
}

const getPoolSnapshot = (poolId, timestamp, networkId) => {
  const query = `query { poolSnapshots(where: { timestamp: ${timestamp}, pool: "${poolId}" } ) { swapFees } }`

  let result = executeBalancerCall('poolSnapshots[0]', query, networkId)
  return result
}

module.exports = {
  getPoolInfo,
  getPoolSnapshot,
}
