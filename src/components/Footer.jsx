import LOGO from "../assets/logo.png";
import { MdOutlineEmail } from "react-icons/md";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaRegCopyright,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="w-full bg-[#F5F1FE] sm:p-8 p-4">
      <div className="flex md:flex-nowrap flex-wrap justify-around md:gap-2 gap-8">
        <div
          className="flex flex-col"
          //   onClick={() => navigate("/dashboard")}
        >
          <div className="flex items-center gap-2 my-2 cursor-pointer">
            <img src={LOGO} alt="" className="h-[40px] w-[40px]" />
            <h4 className="font-bold text-lg text-[#6D31ED]">Smart Gallery</h4>
          </div>
          <div className="flex sm:flex-nowrap flex-wrap gap-2">
            <div className="w-full border-2 border-gray-400 rounded-full p-2 flex gap-1 items-center">
              <MdOutlineEmail className="text-xl text-gray-400" />
              <input
                type="text"
                className="border-0 outline-0"
                placeholder="Input your email"
              />
            </div>
            <button className="w-full py-2 px-4 cursor-pointer bg-gradient-to-r from-[#6D31ED] to-[#3E1C87] hover:opacity-90 text-white rounded-full font-semibold">
              Subscribe
            </button>
          </div>
        </div>
        <div className="w-full flex sm:flex-nowrap flex-wrap md:justify-evenly justify-center lg:gap-0 md:gap-2 gap-6">
          <div>
            <h1 className="xl:text-xl lg:text-lg text-md font-semibold">
              About us
            </h1>
            <ul className="flex flex-col gap-1 my-2">
              <li>How it Works</li>
              <li>Pricing</li>
              <li>Features</li>
            </ul>
          </div>
          <div>
            <h1 className="x:text-xl lg:text-lg text-md font-semibold">
              Support & Legal
            </h1>
            <ul className="flex flex-col gap-1 my-2">
              <li>FAQs</li>
              <li>Promotions</li>
            </ul>
          </div>
          <div>
            <h1 className="x:text-xl lg:text-lg text-md font-semibold">
              Contact us
            </h1>
            <ul className="flex gap-4 items-center my-2">
              <li>
                <FaFacebook className="text-xl" />
              </li>
              <li>
                <FaTwitter className="text-xl" />
              </li>
              <li>
                <FaInstagram className="text-xl" />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center items-center gap-1 text-gray-600 mt-4">
        <FaRegCopyright/>
        <p className="text-sm">2025 Smartgallery. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
