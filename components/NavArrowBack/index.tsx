import Button from "@ui/Button";
import NavLogIn from "components/navbar/NavLogin";
import { useRouter } from "next/router";

const NavArrow = () => {
  const router = useRouter();

  const handleBackClick = () => {
    console.log(router.asPath);
    if (router.pathname === "/") {
      router.push("/");
    } else {
      router.back();
    }
  };

  return (
    <>
      {router.pathname != "/" && (
        <div className="py-2 relative 2xl:-left-[15%] xl:-left-[5%] md:left-0">
          <Button
            classTlw="md:bg-primary"
            text="Back"
            outline={true}
            onClickHandler={handleBackClick}
          />
          <svg
            className="w-5 h-5 transform rotate-90 absolute bottom-[20px] 2xl:left-[15px] xl:left-[5px] md:left-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      )}
      <NavLogIn />
    </>
  );
};

export default NavArrow;
