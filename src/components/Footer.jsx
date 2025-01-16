import React from 'react';
import { GiRotaryPhone } from "react-icons/gi";
import { TbMailFilled } from "react-icons/tb";
import { FaRegCopyright } from "react-icons/fa";

const Footer = ({ noMargin }) => {
  return (
    <div className={`h-250 mt-12 max-w-7xl mx-auto`}>
      <div className="h-[1px] bg-blue-950"></div>
      <div className="grid grid-cols-4 m-5 gap-20 font-medium text-blue-950 mt-5">
        {/* Hospital Info Section */}
        <div className="ml-2 col-span-2">
          <div className="flex items-center mb-3">
            {/* Hospital Logo */}
            {/* <img src={logo} className="h-[57px] w-[41px] mr-3" alt="Hospital Logo" /> */}
            <div>
              <p className="font-bold text-xs">City Health Hospital</p>
              <p className="text-xs">Your Trusted Care</p>
            </div>
          </div>
          <div className="text-xs text-justify mr-16">
            City Health Hospital has been providing exceptional healthcare services for over 25 years. Our mission is to deliver compassionate care and advanced medical solutions to all patients. We are equipped with state-of-the-art facilities and a dedicated team of healthcare professionals.
          </div>
        </div>

        {/* Contact Us Section */}
        <div>
          <p className="font-bold text-xs mb-2">Contact Us</p>
          <div className="text-xs">
            <h6 className="mb-3">
              City Health Hospital, Main Street, Metro City, Country.
            </h6>
            <h6>
              <GiRotaryPhone className="inline-block mr-2" />
              Phone: +(94) 123 456 789
            </h6>
            <h6>
              <TbMailFilled className="inline-block mr-2" />
              E-mail: info@cityhealthhospital.com
            </h6>
          </div>
        </div>

        {/* Quick Links Section */}
        <div>
          <p className="font-bold text-xs mb-2">Quick Links</p>
          <div className="text-xs">
            <a
              href="/departments"
              className="hover:text-blue-900 underline block"
            >
              Departments
            </a>
            <a
              href="/appointments"
              className="hover:text-blue-900 underline block"
            >
              Book an Appointment
            </a>
            <a href="/doctors" className="hover:text-blue-900 underline block">
              Our Doctors
            </a>
            <a href="/services" className="hover:text-blue-900 underline block">
              Services
            </a>
            <a
              href="/contact-us"
              className="hover:text-blue-900 underline block"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="text-xs flex justify-center items-center">
        <FaRegCopyright className="m-2" />
        <h6 className="text-center">
          City Health Hospital. All rights reserved.
        </h6>
      </div>
    </div>
  );
};

export default Footer;
