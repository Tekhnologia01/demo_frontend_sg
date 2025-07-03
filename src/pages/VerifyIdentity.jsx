import LOGO from "../assets/logo.png";
import User from "../assets/user.svg";
import BgVideo from "../assets/bg-player.mp4";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PiHandTap } from "react-icons/pi";
import { TbUserScan, TbFaceMaskOff } from "react-icons/tb";
import { MdBlurOff } from "react-icons/md";
import { GiSpectacles } from "react-icons/gi";
import VerifyIdentityModal from "../modals/VerifyIdentityModal";

const VerifyIdentity = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="video-background fixed inset-0 w-full h-full z-[-1]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center"
        >
          <source src={BgVideo} type="video/mp4" />
          <source src={BgVideo.replace(".mp4", ".webm")} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
      {/* <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
        <img
          src={LOGO}
          alt="Smart Gallery Logo"
          className="h-[36px] w-[36px]"
        />
        <h4 className="font-bold text-lg text-[#6D31ED]">Smart Gallery</h4>
      </div> */}
      {/* <div className="min-h-screen flex justify-center items-center relative md:mt-0 mt-4">
        <div className="p-8 m-2 mt-8 rounded-2xl shadow-lg sm:max-w-2xl max-w-md w-full bg-white/10 backdrop-blur-lg border border-white/20">
          <div className="flex flex-col items-center gap-2">
            <h2 className="font-bold text-center text-3xl text-[#6D31ED]">
              Take a selfie to verify your identity
            </h2>
            <span className="text-[14px] text-white w-[80%] text-center py-0 my-0">
              Link will be sent to your mobile number
            </span>

            <div className="bg-[#F5F1FE87] flex justify-center w-32 h-28 mt-8 rounded border border-dashed border-[#B191F5] cursor-pointer">
              <img src={User} alt="" />
            </div>
            <div className="sm:w-1/5 w-1/3 my-2">
              <button className="font-semibold text-white w-full rounded-full flex gap-1 justify-center items-center outline-none border-none p-2 cursor-pointer bg-gradient-to-r from-[#3E1C87] to-[#6D31ED] hover:opacity-90">
                Click
                <PiHandTap className="text-xl" />
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <div className="group w-32 h-28 flex flex-col justify-center items-center rounded-xl hover:shadow-lg hover:bg-[#F5F1FE33] hover:backdrop-blur-3xl cursor-pointer hover:text-[#6D31ED]">
                <div className="p-2 rounded-full border border-black group-hover:border-[#6D31ED]">
                  <TbUserScan className="text-3xl" />
                </div>
                <span>Only 1 face</span>
              </div>
              <div className="group w-32 h-28 flex flex-col justify-center items-center rounded-xl hover:shadow-lg hover:bg-[#F5F1FE33] hover:backdrop-blur-3xl cursor-pointer hover:text-[#6D31ED]">
                <div className="p-2 rounded-full border border-black group-hover:border-[#6D31ED]">
                  <MdBlurOff className="text-3xl" />
                </div>

                <span>No Blur</span>
              </div>
              <div className="group w-32 h-28 flex flex-col justify-center items-center rounded-xl hover:shadow-lg hover:bg-[#F5F1FE33] hover:backdrop-blur-3xl cursor-pointer hover:text-[#6D31ED]">
                <div className="p-2 rounded-full border border-black group-hover:border-[#6D31ED]">
                  <TbFaceMaskOff className="text-3xl" />
                </div>

                <span>No Mask</span>
              </div>
              <div className="group w-32 h-28 flex flex-col justify-center items-center rounded-xl hover:shadow-lg hover:bg-[#F5F1FE33] hover:backdrop-blur-3xl cursor-pointer hover:text-[#6D31ED]">
                <div className="p-2 rounded-full border border-black group-hover:border-[#6D31ED]">
                  <GiSpectacles className="text-3xl" />
                </div>
                <span>No Spectacles</span>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <VerifyIdentityModal isOpen={true} />
    </>
  );
};

export default VerifyIdentity;
