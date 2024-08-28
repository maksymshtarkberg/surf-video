import { useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import { Video } from "types/types";
import { slugifyAndPage } from "utils/helpers";
import { buildTagUrl, buildVideoUrl } from "utils/navigation";
import Link from "next/link";

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

const Menu: NextPage<Props> = ({ cities, videosByCity }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openCity, setOpenCity] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (city: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setOpenCity(city);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setOpenCity(null);
    }, 500);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
      setOpenCity(null);
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
    <div ref={menuRef} className="relative z-10 ">
      <button
        className="flex items-center p-2 border rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
        title="Show Cities"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className="">Menu</span>
        <svg
          className={`w-4 h-4 transform ${
            isMenuOpen === true ? "rotate-0" : "-rotate-90"
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
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {isMenuOpen && (
        <div className="absolute mt-2 left-0 w-56 bg-white border rounded-lg shadow-lg">
          <ul className="py-2">
            {videosByCity.map(({ city, videos }) => (
              <li
                key={city}
                className={`relative ${openCity === city ? "bg-gray-100" : ""}`}
                onMouseEnter={() => handleMouseEnter(city)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className="flex justify-between w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={openCity === city}
                >
                  <span className="truncate hover:underline">
                    <Link href={buildTagUrl(city, "city")}>{city}</Link>
                  </span>
                  <svg
                    className={`w-4 h-4 transform ${
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
                    ></path>
                  </svg>
                </button>

                {openCity === city && (
                  <ul className="absolute left-full top-0 mt-0 ml-2 w-48 bg-white border rounded-lg shadow-lg">
                    {videos.map(({ slug, title }) => (
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <Link
                          key={slug}
                          href={buildVideoUrl(slug)}
                          className="block truncate "
                        >
                          <p>{title}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Menu;
