import { RxCross1 } from "react-icons/rx";
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
import { useEffect, useRef, useState } from "react";
import { MdCameraAlt } from "react-icons/md";

// SelfieCapture component
import { forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";

const SelfieCapture = forwardRef(({ onCapture, onClose }, ref) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Expose stopCamera method to parent via ref
  useImperativeHandle(ref, () => ({
    stopCamera: () => {
      const stream = videoRef?.current?.srcObject;
      stream?.getTracks().forEach((track) => track.stop());
    },
  }));

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch (err) {
        console.error("Camera access error", err);
      }
    };
    startCamera();

    return () => {
      const stream = videoRef?.current?.srcObject;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const capturePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 200, 150);
    const imageData = canvasRef.current.toDataURL("image/png");
    onCapture(imageData);
  };

  return (
    <div className="relative w-[480px] h-[280px] rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-800 bg-black">
      <video
        ref={videoRef}
        width="480"
        height="280"
        className="object-cover w-full h-full"
        autoPlay
      />
      <canvas ref={canvasRef} width="480" height="360" className="hidden" />

      {/* Floating Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-6 bg-black/40 px-6 py-3 rounded-full backdrop-blur-sm">
        {/* Capture Button */}
        <button
          onClick={capturePhoto}
          className="w-12 h-12 bg-white rounded-full border-[4px] border-gray-800 flex items-center justify-center hover:scale-110 transition-transform"
          title="Capture"
        >
          <MdCameraAlt className="text-xl text-gray-800" />
        </button>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold hover:bg-red-700 transition"
          title="Cancel"
        >
          ✕
        </button>
      </div>

    </div>
  );
});

const VerifyIdentityModal = ({ isOpen }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const cameraRef = useRef(null);
  const { userData } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const handleModalClose = () => {
    cameraRef?.current?.stopCamera?.();
    setShowCamera(false);
    onClose();
  };

  console.log("capture", capturedImage);

  const handleCapture = (image) => {
    setCapturedImage(image);
    setIsVerified(false);
    setIsVerifying(true);
    cameraRef?.current?.stopCamera?.();
    setShowCamera(false);

    // Async verification
    verifyProfilePicture(image).finally(() => setIsVerifying(false));
  };

  const handleDelete = () => {
    setCapturedImage(null);
  };

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const verifyProfilePicture = async (imageUrl) => {
    try {
      const imageFile = dataURLtoFile(imageUrl, "captured_photo.jpg");

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("user_id", userData?.user_id);

      return await toast.promise(
        axios.post(
          `http://192.168.1.60:8000/api/validate_profile_picture/`,
          formData
        ),
        {
          loading: "Verifying...",
          success: (res) => {
            setIsVerified(true);
            return res?.data?.messsage || "Profile photo verified successfully";
          },
          error: (err) => {
            console.log(err);

            return (
              err?.response?.data?.reason || "Failed to verify profile photo"
            );
          },
        }
      );
    } catch (error) { }
  };

  return !isOpen ? null : (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur-xs"
    // onClick={(e) => {
    //   if (e.target === e.currentTarget) handleModalClose();
    // }}
    >
      <div
        className="bg-white/60 sm:max-w-fit backdrop-blur-lg p-6 rounded-xl shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl cursor-pointer"
        >
          <RxCross1 />
        </button> */}

        <div className="p-2 rounded-2xl sm:max-w-2xl max-w-xl w-full">
          <div className="flex flex-col items-center gap-2">
            <h2 className="font-bold text-center text-3xl text-[#6D31ED]">
              Take a selfie to verify your identity
            </h2>

            {capturedImage && isVerified ? (
              <div className="mt-6 flex flex-col items-center">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="rounded border"
                />
                {/* <div className="w-full flex gap-2 my-2">
                  <button
                    onClick={handleDelete}
                    className="font-semibold text-white w-1/2 rounded-full flex gap-1 justify-center items-center outline-none border-none p-2 cursor-pointer bg-gradient-to-r from-[#d74032] to-[#87251c] text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div> */}
              </div>
            ) : (
              <div
                onClick={() => setShowCamera(true)}
                className="bg-[#F5F1FE87] flex justify-center w-32 h-28 mt-8 rounded border border-dashed border-[#B191F5] cursor-pointer"
              >
                <img src={User} alt="" />
              </div>
            )}

            <div className="sm:w-1/5 w-1/3 my-2">
              <button
                onClick={() => !isVerifying && setShowCamera(true)}
                disabled={isVerifying}
                className={`font-semibold text-white w-full rounded-full flex gap-1 justify-center items-center outline-none border-none p-2 cursor-pointer ${isVerifying
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#3E1C87] to-[#6D31ED] hover:opacity-90"
                  }`}
              >
                {isVerifying ? "Verifying..." : "Click"}
                {!isVerifying && <PiHandTap className="text-xl" />}
              </button>
            </div>

            {showCamera && (
              <SelfieCapture
                ref={cameraRef}
                onCapture={handleCapture}
                onClose={() => {
                  cameraRef?.current?.stopCamera?.();
                  setShowCamera(false);
                }}
              />
            )}

            {/* Instructions */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {[
                ["Only 1 face", <TbUserScan />],
                ["No Blur", <MdBlurOff />],
                ["No Mask", <TbFaceMaskOff />],
                ["No Spectacles", <GiSpectacles />],
              ].map(([label, icon], idx) => (
                <div
                  key={idx}
                  className="group w-32 h-28 flex flex-col justify-center items-center rounded-xl cursor-pointer"
                >
                  <div className="p-2 rounded-full border border-black">
                    {icon}
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyIdentityModal;
