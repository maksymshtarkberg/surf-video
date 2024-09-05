import Link from "next/link";
import React, { FC } from "react";
import { classNames } from "utils/helpers";

type Props = {
  text: string;
  outline?: boolean;
  href?: string;
  onClickHandler?: () => void;
  classTlw?: string;
  children?: any;
};

const Button: FC<Props> = ({
  text,
  onClickHandler,
  href,
  outline = false,
  classTlw,
  children,
}) => {
  let className = classNames(
    `${
      classTlw ?? ""
    } bg-primary py-2 px-4 md:px-6 lg:px-8 text-sm sm:text-base md:text-md font-medium rounded-md border-2 border-white hover:bg-secondary hover:text-white w-full sm:w-auto shadow-md transition duration-300 cursor-pointer`,
    outline
      ? `border-2 border-primary lg:bg-transparent text-inverted hover:text-white`
      : `border border-transparent lg:bg-secondary text-inverted`
  );

  const buttonJSX = (
    <button onClick={onClickHandler} className={className}>
      {children}
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
