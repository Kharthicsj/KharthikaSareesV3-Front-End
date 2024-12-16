import React from "react";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
      <div className="bg-white w-full max-w-4xl shadow-md rounded-md px-8 py-12 border border-gray-300">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Shipping and Delivery Policy
        </h1>

        {/* Section 1 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            1. Shipping Timeline
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We will ship your products within 4 days of receiving your order.
            Once shipped, the delivery timeline may vary depending on your
            location and other factors, but we aim for delivery within 7 days.
          </p>
        </div>

        {/* Section 2 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            2. Security Checks
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Before shipping your order, we perform thorough security checks to
            ensure the safety and quality of your products.
          </p>
        </div>

        {/* Section 3 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            3. Product Verification
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Upon completing the security checks, we will send you an image of
            your packed product via WhatsApp for verification. Please respond
            with your confirmation to proceed with shipping.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            For inquiries regarding shipping and delivery:
          </h2>
          <p className="text-gray-600">
            Email us at{" "}
            <a
              href="mailto:kharthikasarees@gmail.com"
              className="text-blue-600 hover:underline"
            >
              kharthikasarees@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
