import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import { HiLocationMarker, HiPhone, HiMail } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      {/* Social Media Icons */}
      <h3 className="font-bold text-xl mb-6 text-center">Follow Us</h3>
      <div className="flex justify-center space-x-4 mb-8">
        <a href="#facebook" className="hover:text-gray-300">
          <FaFacebook size={20} />
        </a>
        <a href="#twitter" className="hover:text-gray-300">
          <FaTwitter size={20} />
        </a>
        <a href="#linkedin" className="hover:text-gray-300">
          <FaLinkedin size={20} />
        </a>
        <a href="#github" className="hover:text-gray-300">
          <FaGithub size={20} />
        </a>
      </div>

      {/* Footer Content */}
      <div className="container mx-auto px-4 max-w-screen-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Store Locations */}
        <div>
          <h3 className="font-bold text-xl mb-4">Store Locations</h3>
          <ul className="space-y-2">
            <li>Merkato</li>
            <li>Bole</li>
            <li>Megenagna</li>
            <li>Ayer tena</li>
          </ul>
        </div>

        {/* Useful Links Section */}
        <div>
          <h4 className="font-semibold text-lg mb-4 border-b border-gray-600 pb-2">Useful Links</h4>
          <ul className="space-y-2">
            <li><a href="#home" className="hover:text-gray-300">Home</a></li>
            <li><a href="#help" className="hover:text-gray-300">Help</a></li>
            <li><a href="#contact" className="hover:text-gray-300">Contact Us</a></li>
          </ul>
        </div>

        {/* Related Links Section */}
        <div>
          <h4 className="font-semibold text-lg mb-4 border-b border-gray-600 pb-2">Related Links</h4>
          <ul className="space-y-2">
            <li><a href="#job-vacancy" className="hover:text-gray-300">Job Vacancy</a></li>
            <li><a href="#application-form" className="hover:text-gray-300">Vehicle Application Form</a></li>
            <li><a href="#employment" className="hover:text-gray-300">Vehicle Application Recruitment</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h4 className="font-semibold text-lg mb-4 border-b border-gray-600 pb-2">Contact</h4>
          <ul className="space-y-2">
            <li className="flex items-center">
              <HiLocationMarker className="mr-2" />
              Addis Ababa, Ethiopia
            </li>
            <li className="flex items-center">
              <HiMail className="mr-2" />
              dandy@example.com
            </li>
            <li>
              <i className="fas fa-phone text-orange-500 mr-2"></i> {/* Phone Icon */}
              Call Us:{" "}
              <a href="tel:+251-1234567" className="text-orange-500 hover:text-orange-400">
                +251-1234567
              </a>
            </li>
            <li>
              <i className="fas fa-phone text-orange-500 mr-2"></i> {/* Phone Icon */}
              Call Us:{" "}
              <a href="tel:+251-927446171" className="text-orange-500 hover:text-orange-400">
                +251-927446171
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Copyright: African Star 🌟
        </p>
      </div>
    </footer>
  );
};

export default Footer;