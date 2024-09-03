import { FC } from "react";
import Nav from "components/NavArrowBack";

type Props = {};

const Navbar: FC<Props> = ({}) => {
  return (
    <header className="sticky z-10 top-0 bg-transparent">
      <nav className="flex flex-row items-center max-w-5xl mx-auto px-2 lg:px-0 ">
        <Nav />
      </nav>
    </header>
  );
};

export default Navbar;
