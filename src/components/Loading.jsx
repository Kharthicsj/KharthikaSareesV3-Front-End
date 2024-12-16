import React from "react";
import Lottie from "react-lottie";
import loadingAnimation from "../assets/Loading.json";

const Loading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex justify-center items-center h-screen bg-transparent">
      <Lottie options={defaultOptions} height={200} width={200} />
    </div>
  );
};

export default Loading;
