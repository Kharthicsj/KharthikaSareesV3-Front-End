import React from "react";
import Lottie from "react-lottie";
import CartBG from "../assets/cartBG.json"

const BackgroundAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: CartBG,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="absolute mt-20 inset-0 w-full h-full z-[-1] overflow-hidden">
      <Lottie options={defaultOptions} height="100%" width="100%" />
    </div>
  );
};

export default BackgroundAnimation;
