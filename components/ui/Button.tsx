import Link from "next/link";
import React, { FC } from "react";
import { classNames } from "utils/helpers";

type Props = {
  text: string;
  outline?: boolean;
  href?: string;
  onClickHandler?: () => void;
};

const Button: FC<Props> = ({ text, onClickHandler, href, outline = false }) => {
  let className = classNames(
    "py-2 px-4 sm:px-6 md:px-8 lg:px-10 text-sm sm:text-base md:text-md font-medium rounded-md bg-transparent border-2 border-white hover:bg-secondary hover:text-main w-full sm:w-auto shadow-md transition duration-300 cursor-pointer",
    outline
      ? "border-2 border-primary bg-transparent text-main hover:text-main"
      : "border border-transparent bg-secondary text-white"
  );

  const buttonJSX = (
    <button onClick={onClickHandler} className={className}>
      {text}
    </button>
  );

  if (href) {
    return (
      <a href={href} className="w-full md:w-auto">
        {buttonJSX}
      </a>
    );
  } else {
    return <>{buttonJSX}</>;
  }
};

export default Button;
