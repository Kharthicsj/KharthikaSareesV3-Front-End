import React from "react";
import Lottie from "react-lottie";
import OrderAnimation from "../assets/order placed.json"

const OrderPlaced = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: OrderAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex justify-center items-center h-screen bg-transparent">
      <Lottie options={defaultOptions} height={500} width={700} />
    </div>
  );
};

export default OrderPlaced;
