import React, { useState, useRef, useEffect } from "react";
import { Video } from "types/types";
import { buildTagUrl, buildVideoUrl } from "utils/navigation";
import Link from "next/link";
import NavLogIn from "./NavLogin";

type Props = {
  videosByCity: {
    city: string;
    videos: {
      slug: string;
      title: string;
    }[];
  }[];
};

const NavMobile: React.FC<Props> = ({ videosByCity }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openCity, setOpenCity] = useState<string | null>(null);
  const [videoListPosition, setVideoListPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
      setOpenCity(null);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    city: string
  ) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setVideoListPosition({
      left: rect.right - 20,
      top: rect.top - 80,
    });
    timerRef.current = setTimeout(() => {
      setOpenCity(city);
      setIsSubDropdownOpen(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setOpenCity(null);
      setIsSubDropdownOpen(false);
      setVideoListPosition(null);
    }, 200);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setOpenCity(null);
    setIsSubDropdownOpen(false);
  };

  return (
    <div className="relative lg:hidden z-10 sm:block max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <div className="flex w-full sm:w-auto">
        <ul className="relative flex items-center font-medium md:p-0">
          <li>
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-between w-full py-2 px-3"
            >
              Cities
              <svg
                className="w-2.5 h-2.5 ml-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute z-10 font-normal bg-white divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
              >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  {videosByCity.map(({ city, videos }) => (
                    <li
                      key={city}
                      className="relative flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseEnter={(e) => handleMouseEnter(e, city)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {city}
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

                      {isSubDropdownOpen &&
                        openCity === city &&
                        videoListPosition && (
                          <ul
                            className="absolute z-40 w-48 bg-white border rounded-lg shadow-lg"
                            style={{
                              left: videoListPosition.left,
                              top: videoListPosition.top,
                            }}
                          >
                            {videos.map(({ slug, title }) => (
                              <Link href={buildVideoUrl(slug)} key={slug}>
                                <li className="px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                                  {title}
                                </li>
                              </Link>
                            ))}
                          </ul>
                        )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
          <li>
            <a href="#" className="block py-2 px-3 text-gray-900 rounded">
              About us
            </a>
          </li>
        </ul>
        <NavLogIn />
      </div>
    </div>
  );
};

export default NavMobile;
