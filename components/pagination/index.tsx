import Button from "@ui/Button";
import React, { FC } from "react";

type Props = {
  currentPage: number;
  hrefPrevPage?: () => void;
  hrefNextPage?: () => void;
  maxPage: number;
};

const Pagination: FC<Props> = ({
  currentPage,
  hrefPrevPage,
  hrefNextPage,
  maxPage,
}) => {
  return (
    <div className="flex flex-row space-x-1 md:space-x-2 justify-center w-full my-5">
      {currentPage != 1 && (
        <Button text="< Prev" onClickHandler={hrefPrevPage} outline />
      )}
      {currentPage < maxPage && (
        <Button text="Next >" onClickHandler={hrefNextPage} outline />
      )}
    </div>
  );
};

export default Pagination;
