import React from "react";

const PreLoader: React.FC = () => {
  return (
    <div className="loader absolute left-[30%] md:left-[35%] bottom-[40%] h-[130px] md:h-[200px] aspect-square">
      <div className="box">
        <div className="logo">
          <p className="text-sm text-white">Loading...</p>
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
