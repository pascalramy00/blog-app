import React from "react";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="grid grid-cols-2 items-center justify-center min-h-screen">
      <h1 className="text-5xl">
        The <span className="">Cat Blog</span>
      </h1>
      <Image src="/cat.jpg" width="600" height="600" alt="a cat" priority />
    </div>
  );
};

export default Hero;
