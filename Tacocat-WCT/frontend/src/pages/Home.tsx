// import Navbar from '../components/Navbar';
import DeckCard from '../components/DeckCard';
import { useEffect } from 'react';
import '../css/styles.css';
import { simpleAction, connectWallet, spinnerShow, disconnectWallet, buyToken, addToken, unlockWCT } from "../store/actions/wallet";
import { connect, useDispatch } from "react-redux";
// import ReactTooltip from "react-tooltip";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";
// import { MAIN_WCT_ADDRESS, MAIN_TCT_ADDRESS, MAIN_USDT_ADDRESS, TEST_WCT_ADDRESS, TEST_TCT_ADDRESS, TEST_USDT_ADDRESS, } from '../constants';
// import { ENV_MODE } from '../config';

// const WCT_ADDRESS = ENV_MODE ? MAIN_WCT_ADDRESS : TEST_WCT_ADDRESS;
// const TCT_ADDRESS = ENV_MODE ? MAIN_TCT_ADDRESS : TEST_TCT_ADDRESS;
// const USDT_ADDRESS = ENV_MODE ? MAIN_USDT_ADDRESS : TEST_USDT_ADDRESS;

const Home = (simple: any) => {
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(()=>{
  }, [simple])

  return (
    <div
      style={{
        backgroundImage: `url(${simple.bgPath})`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <div><Toaster toastOptions={{className : 'm-toaster', duration : 3000, style : { fontSize: '12px' }}}/></div>
      <div className='container mx-auto'
        style={{
          fontFamily: 'Montserrat',
          // backgroundImage: `url(${simple.bgPath})`
        }}
      >
        {/* Navbar */}
        {/* <Navbar /> */}
        <nav className="z-40 w-full bg-opacity-60 flex items-center">
          <div className="top-6 gap-10 fixed items-center justify-start hidden md:flex">
            <a
              href="/#more-info"
              className="text-[#ffe41e] hover:text-[#8b7c10]"
            >
              <img className=" w-1/2" src={simple.logo} alt="" />
            </a>
            
          </div>

          <div className="z-50 fixed top-6 md:right-20 items-center justify-start flex py-2 px-4">
            <button
                className="font-bold ml-auto bg-[#f9069c] md:flex shadow-md py-2 px-4 text-white hover:bg-pink-600 active:bg-pink-800"
                onClick={() => { 
                  simple.connectState ? dispatch(simple.disconnectWallet()) : dispatch(simple.connectWallet())
                }}
              >
                {simple.connectBtnName}
            </button>
          </div>

          <button
            className="z-50 ml-auto w-14 h-14 flex fixed top-6 right-5 justify-center items-center text-gray-50"
            onClick={() => toggleMenu()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            > 
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </nav>

        {/* Connect Button */}
        {/* <div className="z-50 fixed top-6 md:right-20 items-center justify-start flex py-2 px-4">
          <button
              className="font-bold ml-auto bg-[#f9069c] md:flex shadow-md py-2 px-4 text-white hover:(text-white bg-[#239728])"
              onClick={() => { 
                simple.connectState ? dispatch(simple.disconnectWallet()) : dispatch(simple.connectWallet())
               }}
            >
              {simple.connectBtnName}
          </button>
        </div> */}

        <div className='flex'>
          <img className='m-auto w-3/5' src={simple.banner} alt="" />
        </div>

        {/* More Info */}
        <div
          id="more-info"
          className="flex flex-col mt-16 px-8 gap-8 items-center justify-center"
        >
          <h1 className="text-gray-50 text-5xl" style={{fontFamily: "BoomBox"}}>Wildcash Token presale</h1>
          <p className="w-full md:max-w-screen-lg text-md text-white">
          Welcome to the presale of the Wildcard Token (WCT)
            <br /> <br />
            Want to buy WCT at a 50% discount on launch price? You can! There are limited spots available on the presale whitelist if you are quick enough. Make sure to reserve your whitelist spot by joining our discord and learn about our sign up page.
            <br /><br />
            Wildcard token (WCT) is the in-game currency for this new play-to-earn game. WCT can be spent and earned in a multitude of ways, including within the game, in the marketplace, and in the real world. As play-to-earn gaming heads towards the mainstream, there is no better time to get involved in this largely untapped, skyrocketing market. Wildcard is at the forefront of this trend with an awesome game that has significant earning potential. Check out the videos of alpha-version gameplay and get ready for the full game launch on April 6.
            <br /><br />
            2.500.000.000 (2.5B) tokens of WCT have been set aside for the presale.  Phase 1 will sell 500.000.000 (500M) tokens for the price of $0.0004. Phase 2 will sell 500.000.000 tokens for the price of $0.0005. This means that Phase 1 offers you 50% discount and Phase 2 offers 37.5% discount on the launch price of $0.0008. Phase 3 will be open to the public on PinkSale, so its important you get your whitelist spot as soon as possible! Any unsold tokens may be sold privately to ensure a successful launch.
            <br /><br />
            The NFT Presale will be held on March 30th with your chance to get Wildcard NFTs will that have value in-game and in the marketplace. Both the WCT Token and NFT presales will help support and stabilize the project. From the funds received at both presales, 65% will go directly into the liquidity of the token, and 35% will be used for marketing and the development of the game.
            <br /><br />
            Wildcard will have a starting circulating supply of 10.000.000.000 (10B) tokens. The fully diluted market supply is 20.000.000.000 (20B) tokens, but there is also the option to burn tokens. This is to have a lot of balancing options as the game progresses. The tokens are locked and are unlockable per 20% per 21 days from the moment of the launch, to prevent dumping and keep the token stable.
            <br /><br />
            Join the Wildcard Discord and learn more about how to join the WCT presale. There are limited spaces on the whitelist, so get in early for your best chance at the lowest price.
            <br /><br />
          </p>
        </div>

        {/* Decks */}
        <div
          id="decks"
          className="flex flex-col px-8 pt-20 gap-4 items-center justify-center md:(flex-row gap-8) "
        >
          <DeckCard deckId={0} />
          <DeckCard deckId={1} />
          <DeckCard deckId={2} />
        </div>

        {/* Locked Balance Info */}
        <div
          id="unlock-info"
          className="h-auto flex-col mt-20 mx-auto gap-4 items-center justify-center w-2/5 md:(flex-row gap-8) text-[#ffe41e] border-[#f9069c] border-3 rounded-lg bg-center py-5 pr-10 pl-10"
          // style={{
            // position: 'relative',
            // backgroundSize: '170% 170%',
            // margin: 'auto'
          // }}
        >
          <div className='text-xs md:text-lg'>
            <div className='w-1/2 text-left text-gray-50'>
              Total : <span className="text-[#4dff55]">{simple.totalAirdrop}</span> WCT
            </div>
            <div className='w-1/2'>
            </div>
          </div>
          <div className='text-xs md:text-lg flex mt-4'>
            <div className='w-1/2 text-left text-gray-50'>
              Locked : <span className="text-[#4dff55]">{simple.lockAmount}</span> WCT
            </div>
            <div className='w-1/2 text-right text-gray-50'>
              Unlocked : <span className="text-[#4dff55]">{simple.unlockAmount}</span> WCT
            </div>
          </div>
          <div className='text-xs md:text-lg flex mt-4'>
            <div className='w-2/3 pt-4 text-left text-gray-50'>
              Unlockable: <span className='text-[#4dff55]'>{simple.unlockAvail}</span> WCT
            </div>
            <div className='w-1/3 text-right mt-3'>
              <button
                className="rounded unlock-transform font-bold bg-[#f9069c] text-white shadow-md py-2 px-4 text-gray-800 hover:bg-pink-600 w-full active:(bg-pink-800 shadow)"
                onClick={()=>{
                  if(!simple.connectState) {
                    toast.error("Please connect Wallet first!");
                    return;
                  }
                  if(!simple.unlockStatus) {
                    toast.error("Unlock is disabled!");
                    return;
                  }
                  if(Number(simple.unlockAvail) === 0) {
                    toast.error("No Unlockable tokens.");
                    return;
                  }
                  dispatch(unlockWCT(simple));
                }}
              >
                <p className='text-sm text-white'>Unlock</p>
              </button>
            </div>
          </div>
        </div>        
      </div>
      {/* Footer */}
      <footer className="relative text-center lg:text-left mt-20 pt-10" style={{
          // backgroundImage: `url(${simple.footer})`, backgroundSize: "100%, 100%", backgroundRepeat: "no-repeat"
        }}>
        <img src={simple.footer} className="h-full" alt="footer" />
        <div className="absolute w-full inset-y-1/4 text-gray-50 text-center p-4" >
          <img className='m-auto h-full' src={simple.logo} alt="logo"/>  
          <div className="flex justify-center lg:mb-5 lg:mt-5 md:mb-3 md:mt-2 social-icons">
            <a href="#!" type="button" className="w-7 h-7 rounded-full bg-gray-50  border-2 border-white text-black hover:text-gray-300 leading-normal uppercase hover:bg-gray-50 hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out w-9 h-9 m-1">
              <svg aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="facebook-f"
              className="w-2 h-full mx-auto"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path
                fill="currentColor"
                d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
              ></path>
              </svg>
            </a>

            <a href="#!" type="button" className="w-7 h-7 rounded-full bg-gray-50 border-2 border-white text-black hover:text-gray-300 leading-normal uppercase hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out w-9 h-9 m-1">
              <svg aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="instagram"
              className="w-3 h-full mx-auto"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                ></path>
              </svg>
            </a>


            <a href="#!" type="button" className="w-7 h-7 rounded-full bg-gray-50 border-2 border-white text-black hover:text-gray-300 leading-normal uppercase hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out w-9 h-9 m-1">
              <svg aria-hidden="true"
              focusable="false"
              data-prefix="fab"
                data-icon="twitter"
                className="w-3 h-full mx-auto"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                ></path>
              </svg>
            </a>  
        
          </div>
          <span className="text-gray-50 text-copyright">Copyright © 2021 - WILDCARD: THE PLAY TO EARN GAME</span>
        </div>
      </footer>
    </div>
  );
};

const mapStateToProps = (state: any) =>{
  state = state.simple;
  return { ...state }
}

const mapDispatchToProps = () => {
  return {
    simpleAction: simpleAction,
    connectWallet: connectWallet,
    disconnectWallet: disconnectWallet,
    spinnerShow: spinnerShow,
    buyToken: buyToken,
    addToken: addToken
  }
}

 export default connect(mapStateToProps, mapDispatchToProps)(Home);
