import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="z-40 h-16 w-full px-10 top-0 fixed bg-black bg-opacity-60 flex items-center">
        <div className="h-full w-full gap-10 items-center justify-start hidden md:flex">
          <a
            href="/#more-info"
            className="text-[#ffe41e] hover:text-[#8b7c10]"
          >
            More Info
          </a>
          <a
            href="https://starterdeck.wildcardgame.io"
            className="text-[#ffe41e] hover:text-[#8b7c10]"
          >
            About WildCard Decks
          </a>
          <a
            href="https://wildcardgame.io"
            target="_blank"
            rel="noreferrer"
            className="text-[#ffe41e] hover:text-[#8b7c10]"
          >
            About WildCard
          </a>
        </div>
      </nav>

      {/* Mobile Menu */}
      <button
        className="z-50 fixed top-0 right-5 ml-auto w-14 h-14 flex justify-center items-center text-[#f9069c] bg-[#4dff55] rounded-md hover:(text-white bg-[#239728]) md:hidden"
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

      <div
        className={`
          fixed
          top-0 left-0
          flex flex-col items-center
          pt-10 gap-5
          w-full h-full
          text-white bg-black
          text-2xl

          ${isMenuOpen ? '' : 'hidden'}
        `}
        style={{
          zIndex: 9999
        }}
      >
        <a
          href="/#decks"
          className="text-[#ffe41e] hover:text-[#8b7c10]"
          onClick={() => toggleMenu()}
        >
          More Info
        </a>
        <a
          href="https://starterdeck.wildcardgame.io"
          className="text-[#ffe41e] hover:text-[#8b7c10]"
          onClick={() => toggleMenu()}
        >
          About WildCard Deck
        </a>
        <a
          href="https://wildcardgame.io"
          target="_blank"
          rel="noreferrer"
          className="text-[#ffe41e] hover:text-[#8b7c10]"
          onClick={() => toggleMenu()}
        >
          About WildCard
        </a>
        <button
          className="flex items-center justify-center mt-auto mb-5 w-12 h-12 text-black bg-white rounded-full"
          onClick={() => toggleMenu()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default Navbar;
