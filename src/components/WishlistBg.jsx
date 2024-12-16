import React from "react";
import Lottie from "react-lottie";
import WishlistBG from "../assets/wishlistbg1.json";

const WishListBg = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: WishlistBG,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full">
      <Lottie options={defaultOptions} height="100%" width="100%" />
    </div>
  );
};

export default WishListBg;
