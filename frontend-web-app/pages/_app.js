import { useRouter } from "next/router";
// import { MoralisProvider } from "react-moralis";
import "bootstrap/dist/css/bootstrap.css";
import { ThemeProvider } from "styled-components";
import { theme } from "../styles/styles";
import { Web3ModalProvider } from "../Contexts/Web3ModalProvider";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "/global.scss";
import "./../styles/Home/home.css";

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const path = (/#!(\/.*)$/.exec(router.asPath) || [])[1];
  if (path) {
    router.replace(path);
  }

  return (
    <ThemeProvider theme={theme}>
      <Web3ModalProvider>
        <Component {...pageProps} />
        <ToastContainer
          autoClose={3000}
          theme="colored"
          transition={Flip}
          position="bottom-right"
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Web3ModalProvider>
    </ThemeProvider>
  );
};

export default MyApp;
