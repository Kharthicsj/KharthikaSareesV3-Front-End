import React from "react";
import Lottie from "react-lottie";
import EmptyCartAnimation from "../assets/EmptyCart.json";

const EmptyCart = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: EmptyCartAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex justify-center items-center bg-transparent">
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
};

export default EmptyCart;
