import { MenuIcon, XIcon, SearchIcon } from "@heroicons/react/outline";
import NavButton from "components/navbar/NavButton";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { removePageFromPath } from "utils/helpers";
import NavItem from "./NavItem";
import NavArrow from "components/NavArrowBack";
import NavLogIn from "./NavLogin";

type Props = {};

const Navbar: FC<Props> = ({}) => {
  return (
    <header className="sticky z-10 top-0 bg-transparent">
      <nav className="flex flex-row items-center max-w-5xl mx-auto px-2 lg:px-0 ">
        <NavArrow />
      </nav>
      {/* {true && <div className="mb-36" />} */}
    </header>
  );
};

export default Navbar;
