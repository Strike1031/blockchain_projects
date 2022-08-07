import { useEffect, useState } from "react";
import Spinner from './Spinner';
import { simpleAction, connectWallet, spinnerShow, buyToken, addToken } from "../store/actions/wallet"
import { connect, useDispatch } from "react-redux";
import toast, { Toaster } from 'react-hot-toast';

interface DeckCardProps {
  deckId: number;
  simple?: any
  connectWallet?: any
  buyToken?: any
};

const DeckCard = ({ deckId, simple}: DeckCardProps) => {
  const dispatch = useDispatch();
  const [buyAmount, setBuyAmount] = useState(0);

  useEffect(()=>{
    setBuyAmount(0);
  }, [simple]);

  return (
    <>
      <div><Toaster toastOptions={{className : 'm-toaster', duration : 3000, style : { fontSize: '12px' }}}/></div>

      <div
        className="rounded-lg flex flex-col h-auto  bg-center"
        style={{
          backgroundImage: `url(${simple.imagePath[deckId]})`,
          backgroundSize: "100%, 100%",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* <img src={simple.imagePath[deckId]} className="w-full" alt="" /> */}
          <div className="pb-5">
            <input type="number" id="buyAmount" value={buyAmount} className="mb-4 mt-3/4 text-white shadow appearance-none border rounded w-7/10 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-[#000000c0] text-[#4dff55]" onChange={(e:any)=>{
              setBuyAmount(e.target.value)
            }}/>
            <button
              className="w-8/10 rounded skew-transform font-bold bg-[#f9069c] shadow-md py-2 px-4 text-gray-50 hover:(text-white bg-pink-600) active:(bg-pink-800)"
              onClick={() => {
                  if(!simple.connectState) {
                    toast.error("Please connect Wallet first!");
                    return;
                  }

                  if(!simple.presaleStatus) {
                    toast.error("Presale is not started yet!");
                    return;
                  }
                  
                  if(Number(buyAmount) === 0 || Number(buyAmount) > simple.usdtBalance) {
                    toast.error("Insufficient value!");
                    return;
                  }

                  if(simple.balanceCond[deckId] === false) {
                    if(deckId === 0) {
                      toast.error("Only for WhiteList!");
                      return;
                    }
                  }
                  dispatch(buyToken(deckId, buyAmount, simple))
                }
              }
            >
              <p>Buy</p>
            </button>
          </div>
      </div>

      <Spinner spinnerShow={simple.show} message={simple.message} />
    </>
  );
};

const mapStateToProps = (state: any) =>{
  return { ...state }
}

const mapDispatchToProps = () => {
  return {
    simpleAction: simpleAction,
    connectWallet: connectWallet,
    spinnerShow: spinnerShow,
    buyToken: buyToken,
    addToken: addToken
  }
}

 export default connect(mapStateToProps, mapDispatchToProps)(DeckCard);
