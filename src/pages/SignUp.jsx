import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { IoEyeOffOutline, IoEye } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import LOGO from "../assets/logo.png";
import BgVideo from "../assets/bg-player.mp4"; // Ensure this path is correct
import axios from "axios";
import toast from "react-hot-toast";
import { signUpValidationSchema } from "../validationSchema/signUpSchema";
import { registerUser } from "../features/users/authSlice";
import { useDispatch } from "react-redux";
import VerifyIdentityModal from "../modals/VerifyIdentityModal";

const SignUp = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values, resetForm) => {
    await toast.promise(
      dispatch(
        registerUser({
          name: values.firstName + " " + values.lastName,
          ...values,
        })
      ).unwrap(),
      {
        loading: "Registering...",
        success: (res) => {
          resetForm();
          return res?.data?.message || "Register successful";
        },
        error: (err) => {
          return err?.data?.message || "Registeration Failed";
        },
      }
    );
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup on unmount just in case
    return () => document.body.classList.remove("overflow-hidden");
  }, [isModalOpen]);

  return (
    <>
      <div className=" video-background fixed inset-0 w-full h-full z-[-1]">
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
      <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
        <img
          src={LOGO}
          alt="Smart Gallery Logo"
          className="h-[36px] w-[36px]"
        />
        <h4 className="font-bold text-lg text-[#6D31ED]">Smart Gallery</h4>
      </div>
      <div className="min-h-screen flex justify-center items-center relative lg:top-0 top-12">
        <div className="p-8 m-2 rounded-2xl shadow-lg max-w-lg w-full bg-white/10 backdrop-blur-md border border-white/20">
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              mobileNo: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={signUpValidationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              await handleSubmit(values, resetForm);
              setIsModalOpen(true);
              setSubmitting(false);
            }}
          >
            {({ values, setFieldValue, errors, touched, isSubmitting }) => (
              <Form className="flex flex-col items-center gap-4">
                <h2 className="font-bold text-3xl text-[#4F57E9]">Sign Up</h2>
                <div className="w-full flex sm:flex-row flex-col gap-4">
                  <div className="w-full">
                    <label htmlFor="firstName" className="text-gray-700">
                      First Name
                    </label>
                    <Field
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={values.firstName}
                      className="bg-white/60 w-full rounded-full outline-none border-none p-3 px-4 my-1 text-gray-700"
                    />
                    {errors.firstName && touched.firstName && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.firstName}
                      </div>
                    )}
                  </div>

                  <div className="w-full">
                    <label htmlFor="lastName" className="text-gray-700">
                      Last Name
                    </label>
                    <Field
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={values.lastName}
                      className="bg-white/60 w-full rounded-full outline-none border-none p-3 px-4 my-1 text-gray-700"
                    />
                    {errors.lastName && touched.lastName && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.lastName}
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full">
                  <label htmlFor="email" className="text-gray-700">
                    Email Id
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="example@gmail.com"
                    value={values.email}
                    className="bg-white/60 w-full rounded-full outline-none border-none p-3 px-4 my-1 text-gray-700"
                  />

                  {errors.email && touched.email && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <label htmlFor="mobileNo" className="text-gray-700">
                    Mobile Number
                  </label>
                  <Field
                    type="text"
                    name="mobileNo"
                    placeholder="Enter 10 digit mobile number"
                    value={values.mobileNo}
                    className="bg-white/60 w-full rounded-full outline-none border-none p-3 px-4 my-1 text-gray-700"
                  />
                  {errors.mobileNo && touched.mobileNo && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.mobileNo}
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <label htmlFor="password" className="text-gray-700">
                    Password
                  </label>
                  <div className="bg-white/60 w-full rounded-full p-3 px-4 my-1 flex items-center justify-between">
                    <Field
                      type={isVisible ? "text" : "password"}
                      name="password"
                      value={values.password}
                      placeholder="Enter at least 8+ characters"
                      className="outline-none border-none w-full mr-1 text-gray-700"
                    />
                    {isVisible ? (
                      <IoEye
                        className="cursor-pointer text-xl text-gray-700"
                        onClick={() => setIsVisible(false)}
                      />
                    ) : (
                      <IoEyeOffOutline
                        className="cursor-pointer text-xl text-gray-700"
                        onClick={() => setIsVisible(true)}
                      />
                    )}
                  </div>
                  {errors.password && touched.password && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </div>
                  )}
                </div>
                <div className="w-full">
                  <label htmlFor="password" className="text-gray-700">
                    Confirm Password
                  </label>
                  <div className="bg-white/60 w-full rounded-full p-3 px-4 my-1 flex items-center justify-between">
                    <Field
                      type={isConfirmVisible ? "text" : "password"}
                      name="confirmPassword"
                      value={values.confirmPassword}
                      placeholder="Enter at least 8+ characters"
                      className="outline-none border-none w-full mr-1 text-gray-700"
                    />
                    {isConfirmVisible ? (
                      <IoEye
                        className="cursor-pointer text-xl text-gray-700"
                        onClick={() => setIsConfirmVisible(false)}
                      />
                    ) : (
                      <IoEyeOffOutline
                        className="cursor-pointer text-xl text-gray-700"
                        onClick={() => setIsConfirmVisible(true)}
                      />
                    )}
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  // onClick={()=> navigate('/verify-identity')}
                  className="text-white w-full rounded-full outline-none border-none p-2 cursor-pointer bg-gradient-to-r from-[#3E1C87] to-[#6D31ED] hover:opacity-90"
                >
                  Sign Up
                </button>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Already have an account?{" "}
                    <span
                      className="underline cursor-pointer text-[#4F57E9]"
                      onClick={() => navigate("/login")}
                    >
                      Login here
                    </span>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <VerifyIdentityModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default SignUp;
