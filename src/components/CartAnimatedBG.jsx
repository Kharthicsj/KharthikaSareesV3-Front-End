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
    <div className="absolute z-[-1] bg-transparent">
      <Lottie options={defaultOptions} height="100%" width="100%" />
    </div>
  );
};

export default BackgroundAnimation;
