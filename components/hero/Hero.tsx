import Button from "@ui/Button";
import HeroImg from "../../public/images/hero.png";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative w-full h-screen">
      <Image
        src={HeroImg}
        alt="hero"
        layout="fill"
        objectFit="cover"
        className="w-full h-full"
        unoptimized={true}
      />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Button text="VIEW LIVE CAMS!" href="#cams" />
      </div>
    </div>
  );
};

export default Hero;
