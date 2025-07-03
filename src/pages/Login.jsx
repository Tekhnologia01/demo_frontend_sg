import { Formik, Form, Field } from "formik";
import LOGO from "../assets/logo.png";
import { IoEyeOffOutline, IoEye } from "react-icons/io5";
import { useState } from "react";
import BgVideo from "../assets/bg-player.mp4";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/users/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import { loginValidationSchema } from "../validationSchema/loginSchema";
import { decrypt } from "../services/decrypt";

const Login = () => {
  const [isVisible, setIsVisible] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, resetForm) => {
    await toast.promise(dispatch(loginUser(values)).unwrap(), {
      loading: "Logging in...",
      success: (res) => {
        resetForm();
        return res?.data?.message || "Login successful";
      },
      error: (err) => {
        return err?.data?.message || "Login failed";
      },
    });
  };

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
      <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
        <img
          src={LOGO}
          alt="Smart Gallery Logo"
          className="h-[36px] w-[36px]"
        />
        <h4 className="font-bold text-lg text-[#6D31ED]">Smart Gallery</h4>
      </div>
      <div className="min-h-screen flex justify-center items-center relative">
        <div className="p-8 m-2 mt-8 rounded-2xl shadow-lg max-w-md w-full bg-white/10 backdrop-blur-3xl border border-white/20">
          <Formik
            initialValues={{
              identifier: "",
              password: "",
            }}
            validationSchema={loginValidationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              await handleSubmit(values, resetForm);
              setSubmitting(false);
            }}
          >
            {({ values, setFieldValue, errors, touched, isSubmitting }) => (
              <Form className="flex flex-col items-center gap-6">
                <h2 className="font-bold text-3xl text-[#6D31ED]">Sign In</h2>
                <div className="w-full">
                  <label htmlFor="email" className="text-gray-700">
                    Email/Mobile Number
                  </label>
                  <Field
                    type="text"
                    name="email"
                    placeholder="example@gmail.com"
                    value={values.identifier}
                    onChange={(e) =>
                      setFieldValue("identifier", e.target.value)
                    }
                    className="bg-white/60 w-full rounded-full backdrop-blur-md outline-none border-none p-3 px-4 my-1 text-gray-700"
                  />
                  {errors.identifier && touched.identifier && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.identifier}
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
                      onChange={(e) =>
                        setFieldValue("password", e.target.value)
                      }
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
                <div className="w-full flex justify-between px-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      id="rememberMe"
                      className="h-4 w-4 outline-none cursor-pointer text-gray-700"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-gray-700 cursor-pointer"
                    >
                      Remember Me
                    </label>
                  </div>
                  <div>
                    <p
                      className="text-gray-700 cursor-pointer underline"
                      onClick={() => navigate('/forgot-password')}
                    >
                      Forgot Password
                    </p>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-white w-full rounded-full outline-none border-none p-2 cursor-pointer bg-gradient-to-r from-[#6D31ED] to-[#3E1C87] hover:opacity-90"
                >
                  Sign In
                </button>
                <div className="flex items-center gap-2">
                  <hr className="sm:w-[8rem] w-[6rem] h-[1px] text-white" />
                  <span className="text-[#6D31ED]">Or</span>
                  <hr className="sm:w-[8rem] w-[6rem] h-[1px] text-white" />
                </div>

                <div className="flex justify-center items-center gap-4">
                  <div className="p-3 text-lg rounded-full text-white bg-[#C71610] cursor-pointer">
                    <FaGoogle />
                  </div>
                  <div className="p-3 text-lg rounded-full text-white bg-[#335CA6] cursor-pointer">
                    <FaFacebook />
                  </div>
                  <div className="p-3 text-lg rounded-full text-white bg-[#000] cursor-pointer">
                    <FaApple />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Don't have an account?{" "}
                    <span
                      className="underline cursor-pointer text-[#4F57E9]"
                      onClick={() => navigate("/signup")}
                    >
                      Create here
                    </span>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default Login;