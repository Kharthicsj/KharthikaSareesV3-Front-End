import React from 'react';

const RefundAndCancellation = () => {
  return (
    <div className="bg-gray-100 py-10 px-4">
      <div className="bg-white shadow-lg mx-auto rounded-lg p-8 max-w-4xl border border-gray-300">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center uppercase">
          Refund and Cancellation Policy
        </h1>

        {/* Section 1: Return and Refund Policy */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            1. Return and Refund Policy
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Returns are accepted only for damaged products. If you receive a damaged product, please contact us immediately at{' '}
            <a
              href="mailto:kharthikasarees@gmail.com"
              className="text-blue-500 underline"
            >
              kharthikasarees@gmail.com
            </a>{' '}
            with photos of the damaged item and packaging. We will initiate a refund or replacement as soon as possible. This process takes a maximum of 2 days.
          </p>
        </div>

        {/* Section 2: Cancellation Policy */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            2. Cancellation Policy
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Cancellation requests can be made at any time *before* the product is shipped, as long as the order status is <span className="font-bold text-gray-800">Pending</span>. Once the product is shipped, cancellation requests cannot be accommodated.
          </p>
          <p className="text-gray-600 mt-2">
            <strong>
              <u>Note:</u>
            </strong>{' '}
            Once the product is shipped, it cannot be canceled. Refunds are only initiated for damaged products. We perform four layers of security checks before shipping your order to ensure the product meets our quality standards.
          </p>
          <p className="text-gray-600 mt-2">
            To cancel your order, please contact us at{' '}
            <a
              href="mailto:kharthikasarees@gmail.com"
              className="text-blue-500 underline"
            >
              kharthikasarees@gmail.com
            </a>{' '}
            with your order details.
          </p>
        </div>

        {/* Final Section */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-700">
            We appreciate your understanding of our policies as we aim to
            provide quality products and services.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default RefundAndCancellation;
