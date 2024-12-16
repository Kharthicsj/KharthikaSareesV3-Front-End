import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-100 py-10 px-4">
      <div className="bg-white shadow-lg mx-auto rounded-lg p-8 max-w-4xl border border-gray-300">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center uppercase">
          Terms and Conditions
        </h1>

        {/* Section 1: Acceptance of Terms */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-600 leading-relaxed">
            By accessing or using the services provided by Kharthika Sarees, you agree to comply with and be bound by the following terms and conditions. If you do not agree with any part of these terms, you are prohibited from using our services. 
          </p>
          <p className="text-gray-600 leading-relaxed">
            Your continued use of our website or services constitutes acceptance of any changes or updates to these terms, which may be made at our discretion without prior notice.
          </p>
        </div>

        {/* Section 2: Services */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            2. Services
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Kharthika Sarees offers high-quality sarees and related apparel for purchase. All orders are subject to availability. We reserve the right to discontinue any product or service without prior notice.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our services are intended for personal use only. Reselling or redistribution of our products without permission is strictly prohibited.
          </p>
        </div>

        {/* Section 3: Payment Terms */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            3. Payment Terms
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Payment must be made in full at the time of placing an order. We accept payments through secure online payment gateways and other methods as mentioned on our website. 
          </p>
          <p className="text-gray-600 leading-relaxed">
            In case of payment failures due to technical issues, you are advised to retry or contact our support team at <a href="mailto:kharthikasarees@gmail.com" className="text-blue-500 underline">kharthikasarees@gmail.com</a>.
          </p>
        </div>

        {/* Section 4: User Conduct */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            4. User Conduct
          </h2>
          <ul className="list-disc list-inside text-gray-600">
            <li>You agree not to use our website or services for any unlawful purpose.</li>
            <li>You must not upload or transmit any harmful or malicious content, including viruses or spyware.</li>
            <li>You agree not to interfere with the website’s functionality or compromise its security.</li>
            <li>All users must provide accurate and up-to-date personal information when placing an order.</li>
          </ul>
        </div>

        {/* Section 5: Intellectual Property */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            5. Intellectual Property
          </h2>
          <p className="text-gray-600 leading-relaxed">
            All content available on our website, including text, images, designs, logos, and trademarks, is the exclusive property of Kharthika Sarees. Unauthorized use, reproduction, or distribution of any content is strictly prohibited and may lead to legal action.
          </p>
        </div>

        {/* Section 6: Limitation of Liability */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            6. Limitation of Liability
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Kharthika Sarees shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services, including but not limited to damages caused by delays, loss of data, or unauthorized access to your account.
          </p>
        </div>

        {/* Section 7: Governing Law */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            7. Governing Law
          </h2>
          <p className="text-gray-600 leading-relaxed">
            These Terms and Conditions are governed by and construed in accordance with the laws of Tamil Nadu, India. Any disputes arising out of these terms shall be resolved exclusively in the courts of Tamil Nadu.
          </p>
        </div>

        {/* Section 8: Changes to Terms */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            8. Changes to Terms
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Kharthika Sarees reserves the right to update or modify these Terms and Conditions at any time without prior notice. It is your responsibility to review this page periodically for any changes. Continued use of our services after updates implies acceptance of the revised terms.
          </p>
        </div>

        {/* Section 9: Contact Us */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            9. Contact Us
          </h2>
          <p className="text-gray-600 leading-relaxed">
            For any queries or concerns regarding these Terms and Conditions, feel free to contact us at <a href="mailto:kharthikasarees@gmail.com" className="text-blue-500 underline">kharthikasarees@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
