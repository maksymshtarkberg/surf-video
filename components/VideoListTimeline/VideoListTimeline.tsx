import { FC, useEffect, useRef, useState } from "react";

type Props = {};

const VideoListTimeline: FC<Props> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Video Timeline
        <svg
          className={`w-2.5 h-2.5 ml-2 transition duration-300 ${
            isOpen && "rotate-180"
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute flex flex-col-reverse left-0 z-10 bg-white rounded-lg shadow w-44 transform transition-transform duration-300 ease-out opacity-0 translate-y-[-10px] animate-slide-up">
          <ul className="py-2 text-sm text-gray-700 ">
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">
                Settings
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">
                Earnings
              </a>
            </li>
          </ul>
          <div className="border-b-primary border-b-2">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Separated link
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoListTimeline;
