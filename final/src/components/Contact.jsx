// Contact.jsx
import React from "react";

const Contact = () => {
  return (
    <section className="mb-32">
      {/* Google Map Embed */}
      <div
  id="map"
  className="relative h-[300px] overflow-hidden bg-cover bg-[50%] bg-no-repeat"
>
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63866.91884930896!2d38.713936647670725!3d9.025531062697333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85c4a9f3c6c7%3A0x41e2e403bbb013a5!2sSengatera%2C%20Addis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1714250892032!5m2!1sen!2sus"
    width="100%"
    height="480"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
  ></iframe>
</div>



      {/* Form Card */}
      <div className="container px-6 md:px-12">
        <div className="-mt-[100px] rounded-2xl border border-white/30 bg-white/80 backdrop-blur-xl shadow-lg px-6 py-12 md:px-12 md:py-16">
          <div className="flex flex-wrap">
            {/* Form Section */}
            <div className="mb-12 w-full lg:w-5/12 md:px-3 lg:px-6">
              <form className="space-y-6">
                {["name", "email", "message"].map((field, i) => (
                  <div className="relative" key={i}>
                    {field === "message" ? (
                      <textarea
                        id={field}
                        rows="4"
                        placeholder=" "
                        className="peer w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm outline-none transition-all focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      ></textarea>
                    ) : (
                      <input
                        type={field === "email" ? "email" : "text"}
                        id={field}
                        placeholder=" "
                        className="peer w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm outline-none transition-all focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />
                    )}
                    <label
                      htmlFor={field}
                      className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-green-600"
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                  </div>
                ))}

                {/* Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="copy"
                    defaultChecked
                    className="h-4 w-4 rounded border border-gray-300 text-green-600 focus:ring-0"
                  />
                  <label htmlFor="copy" className="ml-2 text-sm text-gray-600">
                    Send me a copy of this message
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-green-600 px-6 py-3 text-white text-sm font-medium hover:bg-green-700 transition-all duration-200 shadow"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Info Section */}
            <div className="w-full lg:w-7/12">
              <div className="flex flex-wrap">
                {/* Support Info */}
                <div className="mb-12 w-full md:w-6/12 xl:w-6/12 md:px-3 lg:px-6">
                  <div className="flex items-start">
                    <div className="inline-flex items-center justify-center rounded-lg bg-green-100 p-4 text-green-600">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0l6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <p className="mb-1 font-semibold">Technical Support</p>
                      <p className="text-sm text-gray-600">AfricanStar@gmail.com</p>
                      <p className="text-sm text-gray-600">1-600-890-4567</p>
                    </div>
                  </div>
                </div>

                {/* Address Info */}
                <div className="mb-12 w-full md:w-6/12 xl:w-6/12 md:px-3 lg:px-6">
                  <div className="flex items-start">
                    <div className="inline-flex items-center justify-center rounded-lg bg-green-100 p-4 text-green-600">
                      <svg
                        className="h-7 w-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5">
                      <p className="mb-1 font-semibold">Address</p>
                      <p className="text-sm text-gray-600">
                        abcd, <br />
                        xyz
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add more info cards here if needed */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
