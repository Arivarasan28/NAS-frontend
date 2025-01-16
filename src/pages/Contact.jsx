import React from "react";
import contactImage from "../assets/images/contact.jpg"; // Replace with your image path

const Contact = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-center mb-12">CONTACT US</h2>
      <div className="flex flex-col md:flex-row items-center">
        {/* Left Section: Image */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <img
            src={contactImage}
            alt="Contact Us"
            className="rounded-lg shadow-lg w-full"
          />
        </div>

        {/* Right Section: Text */}
        <div className="w-full md:w-1/2 md:pl-8">
          {/* Office Information */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">OUR OFFICE</h3>
            <p>54709 Wilms Station</p>
            <p>Suite 350, Washington, USA</p>
            <p className="mt-4">Tel: (415) 555-0132</p>
            <p>Email: greatstackdev@gmail.com</p>
          </div>

          {/* Careers Information */}
          <div>
            <h3 className="text-xl font-bold mb-2">CAREERS AT PRESCRIPTO</h3>
            <p className="mt-2 mb-4">
              Learn more about our teams and job openings.
            </p>
            <button className="px-4 py-2 border border-gray-700 rounded-md hover:bg-gray-700 hover:text-white">
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
