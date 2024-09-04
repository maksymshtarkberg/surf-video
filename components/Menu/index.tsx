import React, { FC, useEffect, useRef, useState } from "react";
import { Video } from "types/types";
import { buildVideoUrl } from "utils/navigation";
import Link from "next/link";
import Button from "@ui/Button";
import { AboutUs, CitiesSVG, SignIn, SignUp } from "@ui/MenuIcons";

type Props = {
  cities: string[];
  videosByCity: {
    city: string;
    videos: VideoTitle;
  }[];
};

type VideoTitle = {
  slug: string;
  title: string;
}[];

const Menu: FC<Props> = ({ cities, videosByCity }) => {
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

  return (
    <div className="relative z-10 lg:block hidden">
      {!isMenuOpen && (
        <div className="absolute bottom-[25px] 2xl:-left-[15%] xl:-left-[5%] transition">
          <Button
            text="Menu"
            outline={true}
            onClickHandler={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>
      )}

      <div
        ref={menuRef}
        className={`fixed top-0 left-0 z-40 h-screen p-4 transition-transform bg-white dark:bg-gray-800
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:w-72 xl:w-80`}
      >
        <h5 className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
          Menu
        </h5>
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-2 right-2 text-gray-400 bg-transparent hover:bg-primary transition-colors hover:text-gray-900 rounded-lg p-1.5"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
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
          <ul className="flex flex-col space-y-2 h-[89vh]">
            <li className="relative transition">
              <button
                onClick={handleCitiesToggle}
                className={`flex items-center justify-between w-full p-3 rounded-lg text-gray-900 bg-gray-50 hover:bg-gray-100 border-b-4${
                  isCitiesOpen ? "border-none" : ""
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
                <ul className="mt-2 rounded-lg overflow-hidden shadow-md">
                  {videosByCity.map(({ city, videos }) => (
                    <li
                      key={city}
                      className="relative border-solid border-2 border-primary rounded-lg mt-1"
                    >
                      <button
                        onClick={() => handleCityClick(city)}
                        className={`flex items-center justify-between p-3 rounded-sm w-full text-left border-b-2 border-b-primary ${
                          openCity === city ? "bg-secondary border-none" : ""
                        } hover:bg-secondary`}
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
                        className={`overflow-hidden transition-max-height duration-300 ease-in-out ${
                          openCity === city ? "max-h-[300px]" : "max-h-0"
                        }`}
                      >
                        <ul className="z-40 bg-gray-100 max-h-60 overflow-y-auto mt-1 rounded-lg overflow-hidden shadow-md">
                          {videos.map(({ slug, title }) => (
                            <li key={slug} className="block cursor-pointer">
                              <Link href={buildVideoUrl(slug)}>
                                <p className="block px-4 py-2 text-gray-700 hover:bg-white truncate rounded-lg">
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
            <li>
              <a
                href="#"
                className="flex items-center p-3 rounded-lg text-gray-900 bg-gray-50 hover:bg-gray-100 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <AboutUs />
                <span className="ml-3">About us</span>
              </a>
            </li>
            <li style={{ marginTop: "auto" }}>
              <div className="m-1">
                <a
                  href="#"
                  className="flex items-center p-3 rounded-lg text-gray-900 bg-gray-50 hover:bg-gray-100 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <SignIn />
                  <span className="ml-3">Sign In</span>
                </a>
              </div>
              <div className="m-1">
                <a
                  href="#"
                  className="flex items-center p-3 rounded-lg text-gray-900 bg-gray-50 hover:bg-gray-100 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <SignUp />
                  <span className="ml-3">Sign Up</span>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Menu;
