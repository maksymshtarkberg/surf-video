import Button from "@ui/Button";
import NavLogIn from "components/navbar/NavLogin";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Nav = () => {
  const router = useRouter();

  const [isScreenLarge, setIsScreenLarge] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsScreenLarge(window.innerWidth >= 1024);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleBackClick = () => {
    const previousUrl = document.URL;
    console.log(previousUrl);
    console.log(window.location.hostname);
    console.log(previousUrl.includes(window.location.hostname));
    console.log(window.history);
    if (
      router.pathname === "/" ||
      router.pathname === "" ||
      window.history.length <= 2
    ) {
      router.push("/");
    } else if (previousUrl && previousUrl.includes(window.location.hostname)) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleHomeClick = () => {
    router.push("/");
  };

  return (
    <>
      {router.pathname != "/" && (
        <div className="py-2 flex relative 2xl:-left-[15%] xl:-left-[5%] md:left-0">
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
          <Button
            text="Home"
            outline={false}
            onClickHandler={handleHomeClick}
            classTlw="ml-4"
          />
        </div>
      )}
      {isScreenLarge && <NavLogIn />}
    </>
  );
};

export default Nav;
