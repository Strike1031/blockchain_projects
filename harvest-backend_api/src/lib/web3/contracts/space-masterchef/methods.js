const getPoolInfo = (poolId, instance) => instance.methods.poolInfo(poolId).call()
const getTotalAllocPoint = instance => instance.methods.totalAllocPoint().call()
const getSpacePerBlock = instance => instance.methods.spacePerBlock().call()

module.exports = { getPoolInfo, getTotalAllocPoint, getSpacePerBlock }
