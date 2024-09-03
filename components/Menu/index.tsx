import React, { FC, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Video } from "types/types";
import { buildTagUrl, buildVideoUrl } from "utils/navigation";
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
  const [videoListPosition, setVideoListPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const videoListRef = useRef<HTMLUListElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    city: string
  ) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setVideoListPosition({
      left: rect.right + 10,
      top: rect.top,
    });
    setOpenCity(city);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setOpenCity(null);
      setVideoListPosition(null);
    }, 500);
  };

  const handleMouseEnterVideoList = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleMouseLeaveVideoList = () => {
    timerRef.current = setTimeout(() => {
      setOpenCity(null);
      setVideoListPosition(null);
    }, 500);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      videoListRef.current &&
      !videoListRef.current.contains(event.target as Node)
    ) {
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
        <div className="absolute bottom-[25px] 2xl:-left-[15%] xl:-left-[5%]  transition">
          <Button
            text="Menu"
            outline={true}
            onClickHandler={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>
      )}

      <div
        ref={menuRef}
        id="drawer-navigation"
        className={`fixed top-0 left-0 overflow-hidden z-40 h-screen p-4 transition-transform bg-white dark:bg-gray-800 
    ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} 
    lg:w-42 xl:w-44 2xl:w-60`}
        tabIndex={-1}
        aria-labelledby="drawer-navigation-label"
      >
        <h5
          id="drawer-navigation-label"
          className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
        >
          Menu
        </h5>
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          className="text-gray-400 bg-transparent hover:bg-primary transition-colors hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center"
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
            ></path>
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <div className="py-4 overflow-y-auto">
          <ul className="flex flex-col h-[89vh] space-y-2 font-medium flex-1">
            <li>
              <button
                onClick={() => setIsCitiesOpen(!isCitiesOpen)}
                className="flex items-center justify-between p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group w-full text-left"
              >
                <CitiesSVG />
                <span className="ml-3">Cities</span>
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
                  ></path>
                </svg>
              </button>

              {isCitiesOpen && (
                <ul className="mt-2 space-y-2">
                  {videosByCity.map(({ city, videos }) => (
                    <li
                      key={city}
                      className={`relative flex items-center justify-between p-2 rounded-lg ${
                        openCity === city ? "bg-gray-100" : ""
                      }`}
                      onMouseEnter={(e) => handleMouseEnter(e, city)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <a
                        href={buildTagUrl(city, "city")}
                        className="block hover:underline"
                      >
                        {city}
                      </a>
                      <svg
                        className="w-4 h-4"
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
                        ></path>
                      </svg>
                      {openCity === city &&
                        videoListPosition &&
                        ReactDOM.createPortal(
                          <ul
                            ref={videoListRef}
                            className="absolute z-40 w-48 bg-white border rounded-lg shadow-lg"
                            style={{
                              left: videoListPosition.left,
                              top: videoListPosition.top,
                            }}
                            onMouseEnter={handleMouseEnterVideoList}
                            onMouseLeave={handleMouseLeaveVideoList}
                          >
                            {videos.map(({ slug, title }) => (
                              <Link
                                href={buildVideoUrl(slug)}
                                className="block truncate"
                              >
                                <li
                                  key={slug}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  {title}
                                </li>
                              </Link>
                            ))}
                          </ul>,
                          document.body
                        )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <AboutUs />
                <span className="flex-1 ml-3 whitespace-nowrap">About us</span>
              </a>
            </li>
            <div style={{ marginTop: "auto" }}>
              <li>
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <SignIn />
                  <span className="ml-3 whitespace-nowrap">Sign In</span>
                </a>
              </li>
              <li className="mt-auto">
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <SignUp />
                  <span className="flex-1 ml-3 whitespace-nowrap">Sign Up</span>
                </a>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Menu;
