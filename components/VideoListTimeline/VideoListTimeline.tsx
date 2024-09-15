import Button from "@ui/Button";
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
      <Button
        text="Timeline"
        onClickHandler={toggleDropdown}
        classTlw="relative"
      ></Button>

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
