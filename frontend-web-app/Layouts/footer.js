/* eslint-disable @next/next/no-img-element */
import React from "react";
import { FaTelegramPlane, FaTwitter, FaGithub } from "react-icons/fa";
import { BsDiscord } from "react-icons/bs";

export default function Footer() {
  return (
    <div className="footer py-3">
      {/* <Button hasBorder={true} variant="white">
                text
                </Button> */}
      <div className="icons">
        <a
          className="color-white"
          href="https://discord.gg/bQtWMh5HBa"
          target="_blank"
          rel="noreferrer"
        >
          <BsDiscord style={{ width: "25px", height: "auto" }} />
        </a>
        <a
          className="color-white"
          target="_blank"
          href="https://github.com/PozzlePlanet/"
          rel="noreferrer"
        >
          <FaGithub style={{ width: "25px", height: "auto" }} />
        </a>
        <a className="color-white" target="_blank">
          <img className="d-none" src="/img/polyy.png" alt="polyy" />
        </a>
        <a
          className="color-white"
          target="_blank"
          href="https://twitter.com/PozzlePlanet"
          rel="noreferrer"
        >
          <FaTwitter style={{ width: "25px", height: "auto" }} />
        </a>
        <a
          className="color-white"
          target="_blank"
          href="https://t.me/pozzleplanet"
          rel="noreferrer"
        >
          <FaTelegramPlane
            style={{ width: "25px", height: "auto" }}
            className="mr-0"
          />
        </a>
      </div>
    </div>
  );
}
