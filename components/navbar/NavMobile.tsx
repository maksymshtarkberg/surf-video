import React from "react";

import NavLogIn from "./NavLogin";
import Menu from "components/Menu";

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
  return (
    <div className="relative lg:hidden z-10 sm:block max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
      <div className="flex w-full sm:w-auto">
        <Menu
          videosByCity={videosByCity}
          classNameTlw="w-full"
          btnPosition="relative"
        />
        <NavLogIn />
      </div>
    </div>
  );
};

export default NavMobile;
