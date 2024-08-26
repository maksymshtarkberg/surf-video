import Footer from "components/footer";
import Hero from "components/hero/Hero";
import Navbar from "components/navbar";
import React, { FC } from "react";

type BaseLayoutProps = {
  children: React.ReactNode;
};

const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  return (
    <div className="bg-background text-main">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default BaseLayout;
