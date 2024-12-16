import React from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      {/* Top Section */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* About Us */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold mb-4 text-gray-100">About Us</h2>
          <p className="text-gray-400 leading-relaxed">
            At <span className="font-bold text-white">Kharthika Sarees</span>,
            we are passionate about preserving the heritage of handloom sarees
            and chudithar materials. Discover our authentic, handcrafted designs
            that bring elegance to your wardrobe.
          </p>
          <div className="mt-6 text-gray-400 text-sm">
            <p>
              Email:{" "}
              <a
                href="mailto:kharthikasarees@gmail.com"
                className="hover:text-white underline"
              >
                kharthikasarees@gmail.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a
                href="tel:+917708339533"
                className="hover:text-white underline"
              >
                +91 7708339533
              </a>
            </p>
            <p>
              Phone:{" "}
              <a
                href="tel:+917373849533"
                className="hover:text-white underline"
              >
                +91 7373849533
              </a>
            </p>
            <p>
              Phone:{" "}
              <a
                href="tel:+919865857986"
                className="hover:text-white underline"
              >
                +91 9865857986
              </a>
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-lg font-semibold mb-4 text-gray-100">
            Stay Connected
          </h2>
          <div className="flex justify-center md:justify-start space-x-6 text-2xl">
            <a
              href="https://www.facebook.com/profile.php?id=61551011396598"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              title="Facebook"
            >
              <FaFacebook className="text-blue-500" />
            </a>
            <a
              href="https://www.instagram.com/kharthika_sarees"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              title="Instagram"
            >
              <FaInstagram className="text-pink-500" />
            </a>
            <a
              href="https://www.youtube.com/channel/UColMm4MyRnnSM8FuFExYIqA"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              title="YouTube"
            >
              <FaYoutube className="text-red-500" />
            </a>
            {/* <a
              href="https://wa.me/message/RDUZARSJ2ES4E1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
              title="WhatsApp"
            >
              <FaWhatsapp className="text-green-500" />
            </a> */}
          </div>
          <div className="mt-6">
            <Link
              to={"/Shippingpolicy"}
              className="block text-gray-400 hover:text-white underline mb-2"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Shipping Policy
            </Link>
            <Link
              to={"/refundpolicy"}
              className="block text-gray-400 hover:text-white underline mb-2"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Refund and Cancellation
            </Link>
            <Link
              to={"/terms&conditions"}
              className="block text-gray-400 hover:text-white underline mb-2"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Terms And Conditions
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              GST Number:{" "}
              <span className="font-semibold text-white">33AAFFK1337B1Z0</span>
            </p>
          </div>
        </div>

        {/* Google Map */}
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-4 text-gray-100">Visit Us</h2>
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.3547251539767!2d77.18078967516928!3d10.86060148929335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba84d30835759ad%3A0x6d22f43ff137afd7!2sKharthika%20Sarees!5e0!3m2!1sen!2sin!4v1693806464107!5m2!1sen!2sin"
            width="100%"
            height="200"
            style={{ border: 0 }}
            loading="lazy"
            className="rounded-md shadow-md"
          ></iframe>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-gray-900 py-6">
        <p className="text-center text-gray-400 text-sm">
          Made with ❤️ by{" "}
          <a
            href="https://valuable-shower-605264.framer.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-400 underline"
          >
            Kharthic SJ
          </a>{" "}
          | Analyzed and Managed 📈 By{" "}
          <a
            href="https://trusting-anything-621288.framer.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-400 underline"
          >
            Kathirvel S
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
