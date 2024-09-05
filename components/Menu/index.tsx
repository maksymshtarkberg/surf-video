import React, { FC, useEffect, useRef, useState } from "react";
import { Video } from "types/types";
import { buildVideoUrl } from "utils/navigation";
import Link from "next/link";
import Button from "@ui/Button";
import { AboutUs, CitiesSVG, SignIn, SignUp } from "@ui/MenuIcons";

type Props = {
  cities?: string[];
  videosByCity: {
    city: string;
    videos: VideoTitle;
  }[];
  classNameTlw?: string;
  btnPosition?: string;
};

type VideoTitle = {
  slug: string;
  title: string;
}[];

const Menu: FC<Props> = ({
  cities,
  videosByCity,
  classNameTlw,
  btnPosition,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openCity, setOpenCity] = useState<string | null>(null);
  const [isCitiesOpen, setIsCitiesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleCitiesToggle = () => {
    setIsCitiesOpen(!isCitiesOpen);
    if (isCitiesOpen) {
      setOpenCity(null);
    }
  };

  const handleCityClick = (city: string) => {
    setOpenCity(openCity === city ? null : city);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
      setOpenCity(null);
      setIsCitiesOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile && isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      if (isMobile) {
        document.body.style.overflow = "";
      }
    };
  }, [isMenuOpen]);

  return (
    <div className="relative z-10 lg:block self-center">
      {!isMenuOpen && (
        <div className={`${btnPosition} transition`}>
          <Button
            text="Menu"
            outline={true}
            onClickHandler={() => setIsMenuOpen(!isMenuOpen)}
            classTlw="flex items-center justify-between"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="lg:mr-3 md:mr-2 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </Button>
        </div>
      )}

      <div
        ref={menuRef}
        className={`fixed flex flex-col top-0 left-0 z-40 h-full ${classNameTlw} p-4 transition-transform bg-gray-100
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:w-72 xl:w-80`}
      >
        <h5 className="text-base font-semibold text-gray-500 uppercase ">
          Menu
        </h5>
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-2 right-2 text-gray-400 bg-transparent hover:bg-primary transition-colors hover:text-gray-900 rounded-lg p-1.5"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-black"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <div className="py-4 overflow-y-auto">
          <ul className="flex flex-col space-y-2 ">
            <li>
              <a
                href="#"
                className="flex items-center p-3 rounded-lg text-inverted border-primary border-2 bg-gray-50 hover:bg-background"
              >
                <AboutUs />
                <span className="ml-3">About us</span>
              </a>
            </li>
            <li className="relative transition">
              <button
                onClick={handleCitiesToggle}
                className={`flex items-center justify-between w-full p-3 rounded-lg border-primary text-inverted  hover:bg-background border-b-4 ${
                  isCitiesOpen
                    ? "border-2 border-b-[3px] bg-background "
                    : "bg-gray-50"
                }`}
              >
                <CitiesSVG />
                <span className={`ml-3 ${isCitiesOpen ? "underline" : ""}`}>
                  Cities
                </span>
                <svg
                  className={`w-4 h-4 ml-auto transform transition-transform duration-300 ${
                    isCitiesOpen ? "rotate-90" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-max-height duration-300 ease-in-out ${
                  isCitiesOpen ? "max-h-[600px]" : "max-h-0"
                }`}
              >
                <ul className="mt-2 rounded-lg overflow-hidden shadow-sm">
                  {videosByCity.map(({ city, videos }) => (
                    <li
                      key={city}
                      className="relative border-solid border-[1px] border-primary rounded-lg mt-1 bg-gray-50"
                    >
                      <button
                        onClick={() => handleCityClick(city)}
                        className={`flex items-center justify-between p-3 rounded-lg w-full text-left  border-b-primary ${
                          openCity === city
                            ? "bg-primary border-primary border-2 border-b-[3px] bg-opacity-70 hover:bg-primary"
                            : "hover:bg-background border-b-4"
                        } `}
                      >
                        <span
                          className={`block ${
                            openCity === city ? "underline" : ""
                          }`}
                        >
                          {city}
                        </span>
                        <svg
                          className={`w-4 h-4 transform transition-transform duration-300 ${
                            openCity === city ? "rotate-90" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                      <div
                        className={`overflow-hidden transition-max-height duration-300 ease-in-out bg-gray-100  ${
                          openCity === city
                            ? "max-h-[300px] bg-transparent"
                            : "max-h-0"
                        }`}
                      >
                        <ul className="flex flex-col z-40 bg-gray-50 bg-opacity-20 max-h-60 overflow-y-auto mt-1 rounded-lg overflow-hidden shadow-md gap-2">
                          {videos.map(({ slug, title }) => (
                            <li
                              key={slug}
                              className="block cursor-pointer rounded-lg"
                            >
                              <Link href={buildVideoUrl(slug)}>
                                <p className="block px-4 py-2 text-inverted hover:text-main  hover:bg-primary hover:bg-opacity-40 truncate rounded-lg">
                                  {title}
                                </p>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <div
          className="flex flex-col space-y-2 mt-4 justify-end"
          style={{ marginTop: "auto" }}
        >
          <a
            href="#"
            className="flex items-center p-3 rounded-lg text-inverted border-primary border-2 bg-gray-50 hover:bg-background"
          >
            <SignIn />
            <span className="ml-3">Sign In</span>
          </a>
          <a
            href="#"
            className="flex items-center p-3 rounded-lg text-inverted border-primary border-2 bg-gray-50 hover:bg-background"
          >
            <SignUp />
            <span className="ml-3">Sign Up</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Menu;
