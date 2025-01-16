// import React from 'react'

// const About = () => {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default About

import React from 'react';
import ab from "../assets/images/ab.png";

const About = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      {/* About Us Section */}
      <div className="flex flex-col md:flex-row items-center mb-16">
        <div className="w-full md:w-1/2">
          <img
            src={ab}
            alt="About Us"
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="w-full md:w-1/2 md:pl-12 mt-6 md:mt-0">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            About <span className="text-blue-600">Us</span>
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Welcome to NAZ Medical Clinic, your trusted partner in managing your
            healthcare needs conveniently and efficiently. At Prescripto, we
            understand the challenges individuals face when it comes to
            scheduling doctor appointments and managing their health records.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Prescripto is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you're booking your first appointment or managing
            ongoing care, Prescripto is here to support you every step of the
            way.
          </p>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Our Vision
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Our vision at Prescripto is to create a seamless healthcare
            experience for every user. We aim to bridge the gap between patients
            and healthcare providers, making it easier for you to access the
            care you need, when you need it.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Why <span className="text-blue-600">Choose Us</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Efficiency</h3>
            <p className="text-gray-600">
              Streamlined appointment scheduling that fits into your busy
              lifestyle.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Convenience</h3>
            <p className="text-gray-600">
              Access to a network of trusted healthcare professionals in your
              area.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Personalization
            </h3>
            <p className="text-gray-600">
              Tailored recommendations and reminders to help you stay on top of
              your health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
