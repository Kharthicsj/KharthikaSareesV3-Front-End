import React from "react";
import ProductByFabric from "../components/ProductByFabric";
import BannerProduct from "../components/Banner";
import FeaturedProducts from "../components/Featuredproducts";
import EthnicHandloomSarees from "../components/EthnicHandloomSarees";
import EthnicHandloomChudis from "../components/EthnicHandloomChudis";

const Home = () => {
  return (
    <div className="bg-gray-100">
      <section className="flex items-center banner-section mt-5 px-[30px]">
        <BannerProduct />
      </section>
      <section className="products-section my-12 px-8">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Explore Fabrics by Category
        </h2>
        <ProductByFabric />
      </section>
      <div>
        <FeaturedProducts />
      </div>
      <div>
        <EthnicHandloomSarees />
      </div>
      <div>
        <EthnicHandloomChudis />
      </div>
    </div>
  );
};

export default Home;
