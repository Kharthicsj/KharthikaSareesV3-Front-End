import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { Link } from "react-router-dom";

const ProductByFabric = () => {
  const [fabricProduct, setFabricProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFabricProduct = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/fetchby-category`
      );
      setFabricProduct(response?.data?.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFabricProduct();
  }, []);

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [loading]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="my-8 px-4">
      <div className="flex flex-wrap justify-center gap-6 md:gap-8 items-center">
        {fabricProduct.map((product, index) => (
          <Link
            to={"/product-fabric/" + product?.fabric}
            className="cursor-pointer"
            key={index}
          >
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300">
              <img
                src={product?.productImage[0]}
                alt="product"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-center mt-3 text-sm md:text-base">
              {product?.fabric}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductByFabric;
