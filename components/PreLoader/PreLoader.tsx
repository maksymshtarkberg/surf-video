import React from "react";

const PreLoader: React.FC = () => {
  return (
    <div className="relative loader h-[130px] md:h-[200px] aspect-square">
      <div className="box">
        <div className="logo">
          <p className="text-sm font-semibold text-white animate-pulse">
            Loading...
          </p>
        </div>
      </div>
      <div className="box"></div>
      <div className="box"></div>
      <div className="box"></div>
      <div className="box"></div>
    </div>
  );
};

export default PreLoader;
