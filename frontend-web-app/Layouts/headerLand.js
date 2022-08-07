/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef, useContext } from "react";
// import { useMoralis } from "react-moralis";
import * as Sentry from "@sentry/nextjs";
import { Web3ModalContext } from "../Contexts/Web3ModalProvider";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "../Components/Button";
import Modal from "../Components/Modal";
import Text from "../Components/Text";
import Column from "../Components/Layouts/Column";
import Row from "../Components/Layouts/Row";
import { connectors } from "../config";
import { theme } from "../styles/styles";
import styled from "styled-components";
import { getEllipsisTxt } from "../utils/fomatters";
import Head from "next/head";


export const metaTitle = 'Pozzle Planet';
export const metaDescription = 'Pozzle Planet is an Impact-2-Earn protocol and mobile-app where you can earn $POZ by joining and sharing positive actions via video';

const WalletItem = styled(Row)`
  cursor: pointer;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background-color: #f8f8f8;
  border-radius: 16px;
`;

export default function Header({ elem }) {
  const routerlink = ["staking", "bond", "mint", "transfer", "nfts"];
  const [current, setCurrent] = useState(routerlink[0]);
  const [showMobileMenu, setMobileMenu] = useState(false);
  const [addBg, setBg] = useState(null);
  const [homeScreen, setHomeScreen] = useState(false);
  const getHeader = useRef("");
  // const { authenticate, isAuthenticated, account, logout } = useMoralis();
  const { connect, disconnect, account } = useContext(Web3ModalContext);

  const [isTransactionDone, setIsTransactionDone] = useState(false);
  const [isDisconnectModalVisible, setDisconnectWalletVisible] =
    useState(false);

  const handleConnectWallet = () => {
    setIsTransactionDone(true);
    connect();
    setIsTransactionDone(false);
  };

  const handleDisconnectWallet = () => {
    setDisconnectWalletVisible(true);
  };

  const isAuthenticated = false;
  const [isAuthModalVisible, setIsAuthModalVisible] = useState();

  const logOut = async () => {
    await logout();
    window.localStorage.removeItem("connectorId");
    console.log("logged out");
  };

  const router = useRouter();

  useEffect(() => {
    if (router.pathname == "/") {
      return setHomeScreen(true);
    }
    setHomeScreen(false);
    return () => {};
  }, [router]);

  // useEffect(() => {
  //   if (showMobileMenu) {
  //     setMobileMenu(false);
  //   }
  // }, [router, showMobileMenu]);

  useEffect(() => {
    const isHash = router.asPath?.split("#");
    const uri = router.asPath?.split("/");
    if (isHash[1]) {
      setCurrent(isHash[1]);
    } else if (uri[1]) {
      setCurrent(uri[1]);
    } else {
      setCurrent("");
    }
    return () => {};
  }, [router]);

  useEffect(() => {
    getHeader.current = document.querySelector(elem);
    if (getHeader.current) {
      window.addEventListener("scroll", () => {
        const { y } = getHeader.current.getBoundingClientRect();
        if (y < 78) {
          setBg(true);
        } else {
          setBg(null);
        }
      });
      return window.removeEventListener("scroll", () => {});
    }
    return () => {};
  }, [elem]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 32) {
        setBg(true);
      } else {
        setBg(false);
      }
    });
    return () => {};
  }, []);

  return (
    <div
      className={`header ${addBg ? "addblur" : "addblur"} ${
        homeScreen ? "home" : ""
      }`}
    >
      <Head>
        <title>{metaTitle}</title>
        <meta name="title" content={metaTitle} />
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_URL}/img/preview.png`} />
        <meta property="og:description" content={metaDescription} />
        <meta name="theme-color" content="#FF0000"/>
        <meta name="twitter:card" content="summary_large_image"/>
      </Head>
      <div className="nav-bar d-flex justify-content-between">
        <div className="logo d-flex align-items-center">
          <Link href="/">
            <a className="yCenter">
              <img
                className="d-none d-lg-flex"
                src="img/PozzlePlanet.svg"
                width={320}
                alt="img-lg"
              />
              <img
                className="d-flex d-lg-none"
                src="img/PozzlePlanet-md.svg"
                width={160}
                alt="img-md"
              />
            </a>
          </Link>
        </div>
        <div
          className={`align-items-center links-cover ${
            showMobileMenu ? "show" : ""
          }`}
        >
          <ul className="d-flex mb-0">
            <li style={{ cursor: "pointer" }}>
              <Link href="/mint">
                Pozzlenaut Minting
              </Link>
            </li>
            <li style={{ cursor: "pointer" }}>
              <a
                href="https://pozzle-planet-1.gitbook.io/poz-purplepaper/"
                target="_blank"
                rel="noreferrer"
              >
                Purplepaper
              </a>
            </li>
            {/* <li style={{ cursor: "pointer" }} className="d-sm-none">
              <Link href="/fast-poz">FastPoz</Link>
            </li> */}
            <li style={{ cursor: "pointer" }}>
              {!account ? (
                <Button
                  // clickHandler={() => setIsAuthModalVisible(true)}
                  clickHandler={handleConnectWallet}
                  hasBorder
                  disabled={isTransactionDone}
                >
                  {!isTransactionDone ? (
                    "Connect Wallet"
                  ) : (
                    <div>Loading...</div>
                  )}
                </Button>
              ) : (
                // <Button clickHandler={() => logOut()}>
                <Button hasBorder clickHandler={handleDisconnectWallet}>
                  {getEllipsisTxt(account, 6)}
                </Button>
              )}
            </li>
          </ul>
        </div>
        <svg
          onClick={() => setMobileMenu(!showMobileMenu)}
          width="50"
          height="54"
          className="vector"
          viewBox="0 0 50 54"
          fill="none"
          style={{ paddingTop: 6 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_232_3413)">
            <path
              d="M20.5 3.75278C23.2846 2.14508 26.7154 2.14508 29.5 3.75278L40.2846 9.97927C43.0692 11.587 44.7846 14.5581 44.7846 17.7735V30.2265C44.7846 33.4419 43.0692 36.413 40.2846 38.0207L29.5 44.2472C26.7154 45.8549 23.2846 45.8549 20.5 44.2472L9.71539 38.0207C6.93078 36.413 5.21539 33.4419 5.21539 30.2265V17.7735C5.21539 14.5581 6.93078 11.587 9.71539 9.97927L20.5 3.75278Z"
              fill="#F8F8F8"
              stroke="url(#paint0_linear_232_3413)"
              strokeWidth="2"
            />
            <path
              d="M33.946 18.2081C34.2278 17.9248 34.402 17.5343 34.402 17.103C34.402 15.5718 33.1608 14.3306 31.6297 14.3306H17.7681C15.904 14.3306 14.3931 15.8415 14.3931 17.7056V29.7592C14.3931 31.6233 15.904 33.1342 17.7681 33.1342H32.7296C34.2654 33.1342 35.6074 31.9422 35.6074 30.3619V20.719C35.6074 19.5801 34.9103 18.6428 33.946 18.2081Z"
              stroke="#362566"
              strokeWidth="1.92857"
            />
            <path
              d="M30.3573 24.6186L31.6774 25.3807V26.905L30.3573 27.6671L29.0373 26.905L29.0373 25.3807L30.3573 24.6186Z"
              stroke="#362566"
              strokeWidth="1.07143"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_232_3413"
              x="0.786822"
              y="1.54688"
              width="48.4264"
              height="51.7634"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="3.42857" />
              <feGaussianBlur stdDeviation="1.71429" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_232_3413"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_232_3413"
                result="shape"
              />
            </filter>
            <linearGradient
              id="paint0_linear_232_3413"
              x1="4.58011"
              y1="46.7933"
              x2="48.1733"
              y2="1.82474"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#CAA7D1" />
              <stop offset="1" stopColor="#B18FB5" stopOpacity="0.38" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <Modal
        isOpen={isAuthModalVisible}
        onClose={() => setIsAuthModalVisible(false)}
      >
        <Column gap="16px">
          <Column gap="8px">
            <Text
              size="18px"
              color={theme.text.darkindigo}
              family="Hanson"
              align="center"
            >
              Connect With Wallet
            </Text>
            <Text size="14px" color={theme.text.lightindigo}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in.
            </Text>
          </Column>
          <Column gap="8px">
            {connectors.map(({ title, icon, connectorId }, key) => (
              <WalletItem
                key={key}
                onClick={async () => {
                  try {
                    // await authenticate({ provider: connectorId });
                    window.localStorage.setItem("connectorId", connectorId);
                    setIsAuthModalVisible(false);
                  } catch (e) {
                    console.error(e);
                    Sentry.captureException(e);
                  }
                }}
              >
                <img src={icon} alt={title} width={40} height={40} />
                <Text
                  color={theme.text.darkindigo}
                  size="16px"
                  family="Open Sans"
                >
                  {title}
                </Text>
              </WalletItem>
            ))}
          </Column>
          <Text size="14px" color={theme.text.indigo} align="end">
            Learn more
          </Text>
        </Column>
      </Modal>
      <Modal isOpen={isDisconnectModalVisible} className="verify-modal">
        <Column gap="16px" align="center" className="verify-content">
          <Column gap="8px" align="center">
            <Text size="14px" color="#25174E8C" align="center">
              Disconnect wallet
            </Text>
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.6276 43.9856H33.3932C34.0211 44.0354 34.6527 43.9559 35.2487 43.752C35.8447 43.5481 36.3926 43.2242 36.8586 42.8002C37.704 41.7644 38.1137 40.4406 38.0013 39.1083V24.9232C38.111 23.5999 37.7018 22.2859 36.8604 21.2588C36.3944 20.8348 35.8465 20.5109 35.2505 20.307C34.6544 20.1031 34.0229 20.0236 33.395 20.0734H14.6276C14.0013 20.0253 13.3719 20.1056 12.7778 20.3094C12.1837 20.5132 11.6376 20.8363 11.1728 21.2588C10.3236 22.2823 9.90901 23.5977 10.0177 24.9232V39.1083C9.90668 40.4416 10.3212 41.7656 11.1728 42.7976C11.6374 43.2205 12.1834 43.5441 12.7775 43.7483C13.3716 43.9526 14.0012 44.0334 14.6276 43.9856ZM15.0345 40.6188C14.8483 40.6331 14.661 40.6097 14.484 40.5502C14.3069 40.4907 14.1436 40.3961 14.0038 40.2723C13.7429 39.9468 13.6195 39.5323 13.6599 39.1171V24.9241C13.6391 24.7199 13.6587 24.5137 13.7177 24.3171C13.7767 24.1206 13.8739 23.9376 14.0038 23.7787C14.2897 23.5353 14.6602 23.4149 15.0345 23.4437H33.0271C33.2078 23.4299 33.3894 23.4525 33.5612 23.51C33.7331 23.5675 33.8917 23.6589 34.0276 23.7787C34.2833 24.1027 34.4031 24.5134 34.3617 24.9241V39.1083C34.4009 39.5217 34.2814 39.9346 34.0276 40.2634C33.8934 40.3864 33.7353 40.4807 33.5632 40.5403C33.3912 40.5999 33.2087 40.6236 33.0271 40.6099L15.0345 40.6188ZM13.6208 21.7564H17.2089V14.9393C17.1623 13.5081 17.4845 12.0889 18.1445 10.8181C18.7149 9.75454 19.5784 8.87689 20.6325 8.28926C21.6743 7.72913 22.8387 7.43595 24.0215 7.43595C25.2043 7.43595 26.3687 7.72913 27.4105 8.28926C28.4587 8.88025 29.317 9.75737 29.8851 10.8181C30.5429 12.0895 30.8627 13.5087 30.8137 14.9393V21.759H34.4053V15.3374C34.4406 13.6343 34.1499 11.9401 33.5487 10.3463C33.0588 9.05572 32.2993 7.88444 31.321 6.91056C30.3427 5.93668 29.168 5.18258 27.8752 4.69857C25.3856 3.76714 22.6432 3.76714 20.1536 4.69857C18.9123 5.16625 17.7796 5.88256 16.825 6.80358C15.8022 7.80389 15.0054 9.01155 14.4881 10.3454C13.881 11.9379 13.5872 13.6326 13.6226 15.3365L13.6208 21.7564Z"
                fill="#25174E"
              />
            </svg>
            <Text size="18px" color="#25174E" align="center" weight="bold">
              Would you like to disconnect your Wallet?
            </Text>
            <Text size="14px" color="#25174E8C" align="center">
              You should confirm that you are disconnecting the wallet.
            </Text>
          </Column>
          <Column gap="8px" align="center">
            <Button
              variant="purple"
              onClick={() => {
                disconnect();
                setDisconnectWalletVisible(false);
              }}
            >
              Disconnect
            </Button>
            <Button
              variant="white"
              onClick={() => setDisconnectWalletVisible(false)}
            >
              Cancel
            </Button>
          </Column>
        </Column>
      </Modal>
    </div>
  );
}
