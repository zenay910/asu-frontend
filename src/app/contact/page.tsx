import React from "react";
import Navbar from "@/components/navbar";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaGoogle, 
  FaTiktok 
} from 'react-icons/fa';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-latte">
      <Navbar />
      
      {/* Page Title */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal text-center mb-8">
          Contact Us
        </h1>
      </div>

      {/* Call to Action Section */}
      <div className="bg-charcoal text-latte py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
            Ready to Find Your Perfect Appliance?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Get in touch with us today! Whether you need a diagnostic, repair service, 
            or want to browse our inventory of quality refurbished appliances, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:(801) 833-7629" 
              className="bg-latte text-charcoal px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-latte/90 transition-colors inline-block text-base sm:text-lg"
            >
              📞 Call Now: (801) 833-7629
            </a>
            <a 
              href="mailto:asuappliancesllc@gmail.com" 
              className="border-2 border-latte text-latte px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-latte hover:text-charcoal transition-colors inline-block text-base sm:text-lg"
            >
              ✉️ Send Email
            </a>
          </div>
        </div>
      </div>

      {/* Contact Information & Map */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-charcoal mb-8">Get In Touch</h3>
            
            {/* Phone */}
            <div className="flex items-start mb-8">
              <div className="bg-charcoal text-latte p-3 rounded-lg mr-4 text-xl flex-shrink-0">
                📞
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-charcoal text-lg mb-1">Phone</h4>
                <a 
                  href="tel:(801) 833-7629" 
                  className="text-charcoal hover:text-charcoal/70 transition-colors text-base sm:text-lg font-medium"
                >
                  (801) 833-7629
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start mb-8">
              <div className="bg-charcoal text-latte p-3 rounded-lg mr-4 text-xl flex-shrink-0">
                ✉️
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-charcoal text-lg mb-1">Email</h4>
                <a 
                  href="mailto:asuappliancesllc@gmail.com" 
                  className="text-charcoal hover:text-charcoal/70 transition-colors text-base sm:text-lg font-medium break-all sm:break-words"
                >
                  asuappliancesllc@gmail.com
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start mb-8">
              <div className="bg-charcoal text-latte p-3 rounded-lg mr-4 text-xl flex-shrink-0">
                📍
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-charcoal text-lg mb-1">Address</h4>
                <address className="text-charcoal not-italic text-base sm:text-lg">
                  2944 S West Temple<br />
                  South Salt Lake, UT 84115
                </address>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex items-start mb-8">
              <div className="bg-charcoal text-latte p-3 rounded-lg mr-4 text-xl flex-shrink-0">
                🕒
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-charcoal text-lg mb-2">Business Hours</h4>
                <div className="text-charcoal text-sm sm:text-base space-y-1">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold text-charcoal text-lg mb-4">Follow Us</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a 
                  href="https://facebook.com/asuappliances" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1877F2] hover:text-[#1877F2]/70 px-4 py-3 rounded-lg transition-colors flex items-center gap-3 border border-gray-200 hover:border-[#1877F2]/30 hover:bg-[#1877F2]/5 text-sm sm:text-base"
                >
                  <FaFacebookF className="text-lg flex-shrink-0" />
                  <span className="truncate">ASU Appliances</span>
                </a>
                <a 
                  href="https://instagram.com/asuappliances" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E4405F] hover:text-[#E4405F]/70 px-4 py-3 rounded-lg transition-colors flex items-center gap-3 border border-gray-200 hover:border-[#E4405F]/30 hover:bg-[#E4405F]/5 text-sm sm:text-base"
                >
                  <FaInstagram className="text-lg flex-shrink-0" />
                  <span className="truncate">@asuappliances</span>
                </a>
                <a 
                  href="https://tiktok.com/@asuappliances" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#000000] hover:text-[#000000]/70 px-4 py-3 rounded-lg transition-colors flex items-center gap-3 border border-gray-200 hover:border-[#000000]/30 hover:bg-[#000000]/5 text-sm sm:text-base"
                >
                  <FaTiktok className="text-lg flex-shrink-0" />
                  <span className="truncate">@asuappliances</span>
                </a>
                {/* Uncomment when Google Business link is ready */}
                {/* <a 
                  href="https://business.google.com/dashboard" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4285F4] hover:text-[#4285F4]/70 px-4 py-3 rounded-lg transition-colors flex items-center gap-3 border border-gray-200 hover:border-[#4285F4]/30 hover:bg-[#4285F4]/5 text-sm sm:text-base"
                >
                  <FaGoogle className="text-lg flex-shrink-0" />
                  <span className="truncate">ASU Appliances</span>
                </a> */}
              </div>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.4805876373657!2d-111.89687722341903!3d40.70743573789426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87528ae59672172d%3A0xcbc6e144fdbd0d2f!2sASU%20Appliance%20Sales%20%26%20Repair!5e0!3m2!1ses-419!2sus!4v1751054500008!5m2!1ses-419!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ASU Appliances Location"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}