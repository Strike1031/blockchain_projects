import React from "react";
import Header from "../Layouts/headerLand";
import Footer from "../Layouts/footer";
import Mint from "../Modules/mint";

export default function Index() {
  return (
    <div>
      <Header elem={"#useProtocolpozzle"} />
      <Mint />
      <Footer />
    </div>
  );
}
