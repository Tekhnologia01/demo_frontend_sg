import { Formik, Form, Field } from "formik";
import LOGO from "../assets/logo.png";
import { useRef, useState } from "react";
import BgVideo from "../assets/bg-player.mp4";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaLessThan } from "react-icons/fa6";
import { IoEyeOffOutline, IoEye } from "react-icons/io5";
import * as Yup from "yup";
import { FaEnvelope, FaMobileAlt } from "react-icons/fa";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [value, setValue] = useState(null);
  const [otpOption, setOtpOption] = useState("mobile");
  const inputRefs = useRef([]);

  const sendOtp = async (values,resetForm) => {
    const payload =
      values.userMobileNo !== ""
        ? { userMobileNo: values.userMobileNo }
        : { userEmail: values.userEmail };

    await toast.promise(
      axios.post(`${import.meta.env.VITE_API_URL}/user/send-otp`, payload),
      {
        loading: "Sending...",
        success: (res) => {
          setValue(
            values.userMobileNo !== "" ? values.userMobileNo : values.userEmail
          );
          resetForm();
          setStep(2);
          return res?.data?.messsage || "Otp sent successfully";
        },
        error: (err) => {
          return err?.data?.messsage || "Failed to send otp";
        },
      }
    );
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
          {step === 1 && (
            <Formik
              initialValues={{
                userMobileNo: "",
                userEmail: "",
                otpOption: "mobile",
              }}
              validationSchema={Yup.object().shape({
                userMobileNo: Yup.string().when("otpOption", {
                  is: "mobile",
                  then: (schema) =>
                    schema
                      .required("Mobile number is required")
                      .matches(/^\d{10}$/, "Must be 10 digits only"),
                  otherwise: (schema) => schema.notRequired(),
                }),
                userEmail: Yup.string().when("otpOption", {
                  is: "email",
                  then: (schema) =>
                    schema
                      .required("Email is required")
                      .email("Invalid email address"),
                  otherwise: (schema) => schema.notRequired(),
                }),
              })}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                sendOtp(values,resetForm);
                setSubmitting(false);
              }}
            >
              {({ values, setFieldValue, errors, touched, isSubmitting }) => (
                <Form className="flex flex-col items-center gap-2">
                  <h2 className="font-bold text-center text-3xl text-[#6D31ED] my-0 py-0">
                    Forgot your password
                  </h2>
                  {/* <span className="text-[14px] text-white w-[80%] text-center py-0 my-0">
                    Link will be sent to your mobile number
                  </span> */}

                  <div
                    role="group"
                    aria-labelledby="otp-option-group"
                    className="w-full"
                  >
                    <p
                      id="otp-option-group"
                      className="text-sm text-center text-white mb-3"
                    >
                      Choose how you want to receive your OTP:
                    </p>

                    <div className="flex gap-4">
                      <label
                        className={`flex items-center gap-3 w-full p-4 border rounded-xl cursor-pointer transition-all 
                     border-gray-300 peer-checked:border-[#6D31ED]
                     has-[input:checked]:border-[#6D31ED] has-[input:checked]:bg-gradient-to-r from-[#6D31ED] to-[#3E1C87]`}
                      >
                        <Field
                          type="radio"
                          name="otpOption"
                          value="mobile"
                          className="hidden peer"
                          onClick={() => {
                            setOtpOption("mobile");
                            setFieldValue("userEmail", "");
                          }}
                        />
                        <div className="flex items-center gap-2">
                          <FaMobileAlt className="text-white" size={20} />
                          <span className="text-sm font-medium text-white">
                            Mobile
                          </span>
                        </div>
                      </label>

                      <label
                        className="flex items-center gap-3 w-full p-4 border rounded-xl cursor-pointer transition-all 
                     border-gray-300 peer-checked:border-[#6D31ED]
                     has-[input:checked]:border-[#6D31ED] has-[input:checked]:bg-gradient-to-r from-[#6D31ED] to-[#3E1C87]"
                      >
                        <Field
                          type="radio"
                          name="otpOption"
                          value="email"
                          className="hidden peer"
                          onClick={() => {
                            setOtpOption("email");
                            setFieldValue("userMobileNo", "");
                          }}
                        />
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-white" size={20} />
                          <span className="text-sm font-medium text-white">
                            Email
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="w-full my-4">
                    <label htmlFor="email" className="text-gray-700">
                      {otpOption === "mobile" ? "Mobile Number" : "Email"}
                    </label>
                    <Field
                      type={otpOption === "mobile" ? "text" : "email"}
                      name="email"
                      placeholder={
                        otpOption === "mobile"
                          ? "+91 8596748596"
                          : "johndoe@gmail.com"
                      }
                      value={
                        otpOption === "mobile"
                          ? values.userMobileNo
                          : values.userEmail
                      }
                      onChange={(e) =>
                        setFieldValue(
                          otpOption === "mobile" ? "userMobileNo" : "userEmail",
                          e.target.value
                        )
                      }
                      className="bg-white/60 w-full rounded-full backdrop-blur-md outline-none border-none p-3 px-4 my-2 text-gray-700"
                    />
                    {otpOption === "mobile" &&
                      touched.userMobileNo &&
                      errors.userMobileNo && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.userMobileNo}
                        </div>
                      )}
                    {otpOption === "email" &&
                      touched.userEmail &&
                      errors.userEmail && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.userEmail}
                        </div>
                      )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    // onClick={() => setStep(2)}
                    className="text-white w-full rounded-full outline-none border-none p-2 cursor-pointer bg-gradient-to-r from-[#6D31ED] to-[#3E1C87] hover:opacity-90"
                  >
                    Send Code
                  </button>

                  <div>
                    <span
                      className="text-[#6D31ED] flex items-center gap-2 my-4 font-medium cursor-pointer"
                      onClick={() => navigate("/login")}
                    >
                      <FaLessThan /> Back to login
                    </span>
                  </div>
                </Form>
              )}
            </Formik>
          )}

          {step === 2 && (
            <Formik
              initialValues={{
                digit1: "",
                digit2: "",
                digit3: "",
                digit4: "",
              }}
              validationSchema={Yup.object().shape({
                
              })}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                const otp =
                  values.digit1 + values.digit2 + values.digit3 + values.digit4;

                const payload =
                  otpOption === "email"
                    ? { userEmail: value, otp }
                    : { userMobileNo: value, otp };
                await toast.promise(
                  axios.post(
                    `${import.meta.env.VITE_API_URL}/user/verify-otp`,
                    payload
                  ),
                  {
                    loading: "Verifying...",
                    success: (res) => {
                      resetForm();
                      setStep(3);
                      return res?.data?.messsage || "OTP Verified successfully";
                    },
                    error: (err) => {
                      return err?.data?.messsage || "Failed to verify OTP";
                    },
                  }
                );
                setSubmitting(false);
              }}
            >
              {({ values, setFieldValue, isSubmitting,resetForm }) => (
                <Form className="flex flex-col items-center gap-2">
                  <h2 className="font-bold text-3xl text-[#6D31ED]">
                    OTP Verification
                  </h2>
                  <span className="text-[14px] text-white w-[80%] text-center">
                    Enter the verification code we just sent to your
                    {otpOption === "mobile"
                      ? " number +91 " +
                        value.slice(0, 2) +
                        "*******" +
                        value.slice(-2)
                      : " email " +
                        value.slice(0, 2) +
                        "*******" +
                        value.slice(-8)}
                    .
                  </span>

                  <div className="w-full my-4">
                    <div className="flex justify-center gap-4">
                      {/* {[1, 2, 3, 4].map((digit, idx) => (
                        <Field
                          key={digit}
                          innerRef={(el) => (inputRefs.current[idx] = el)}
                          type="text"
                          name={`digit${digit}`}
                          maxLength={1}
                          value={values[`digit${digit}`]}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/, "");
                            setFieldValue(`digit${digit}`, value);
                            if (value && inputRefs.current[idx + 1]) {
                              inputRefs.current[idx + 1].focus();
                            }
                          }}
                          className="bg-white/60 w-12 h-12 text-center font-semibold rounded backdrop-blur-md outline-none border-none p-3 px-4 my-2 text-gray-700"
                        />
                      ))} */}
                      {[1, 2, 3, 4].map((digit, idx) => (
                        <Field
                          key={digit}
                          innerRef={(el) => (inputRefs.current[idx] = el)}
                          type="text"
                          name={`digit${digit}`}
                          maxLength={1}
                          value={values[`digit${digit}`]}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/, "");
                            setFieldValue(`digit${digit}`, value);
                            if (value && inputRefs.current[idx + 1]) {
                              inputRefs.current[idx + 1].focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Backspace") {
                              if (values[`digit${digit}`]) {
                                // Just clear the current value
                                setFieldValue(`digit${digit}`, "");
                              } else if (
                                idx > 0 &&
                                inputRefs.current[idx - 1]
                              ) {
                                // Move to the previous input
                                inputRefs.current[idx - 1].focus();
                                setFieldValue(`digit${digit - 1}`, ""); // optional: clear previous
                              }
                            }
                          }}
                          className="bg-white/60 w-12 h-12 text-center font-semibold rounded backdrop-blur-md outline-none border-none p-3 px-4 my-2 text-gray-700"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="text-white w-full rounded-full outline-none border-none p-2 cursor-pointer bg-gradient-to-r from-[#6D31ED] to-[#3E1C87] hover:opacity-90"
                  >
                    Verify
                  </button>

                  <div>
                    <span
                      className="text-[#6D31ED] flex items-center gap-2 my-4 font-medium cursor-pointer"
                      onClick={() => {
                        // setStep(1);
                        // setOtpOption("mobile");
                        
                        otpOption === "mobile" ? sendOtp({userMobileNo:value},resetForm) : sendOtp({userEmail: value},resetForm)
                      }}
                    >
                      <FaLessThan /> Resend Code
                    </span>
                  </div>
                </Form>
              )}
            </Formik>
          )}

          {step === 3 && (
            <Formik
              initialValues={{
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={Yup.object({
                newPassword: Yup.string()
                  .required("Password is required")
                  .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/,
                    "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
                  )
                  .min(8, "Password must be at least 8 characters"),
                confirmPassword: Yup.string()
                  .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
                  .required("Confirm password is required"),
              })}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                const payload =
                  otpOption === "mobile"
                    ? { ...values, userMobileNo: value }
                    : { ...values, userEmail: value };
                await toast.promise(
                  axios.post(
                    `${import.meta.env.VITE_API_URL}/user/reset-password`,
                    payload
                  ),
                  {
                    loading: "Updating...",
                    success: (res) => {
                      resetForm();
                      setOtpOption("mobile");
                      setValue("");
                      setStep(4);
                      return (
                        res?.data?.messsage || "Password reset successfully"
                      );
                    },
                    error: (err) => {
                      return err?.data?.messsage || "Failed to reset password";
                    },
                  }
                );
                setSubmitting(false);
              }}
            >
              {({ values, setFieldValue, errors, touched, isSubmitting }) => (
                <Form className="flex flex-col items-center gap-2">
                  <h2 className="font-bold text-3xl text-[#6D31ED] my-0 py-0">
                    Reset password
                  </h2>
                  <span className="text-[14px] text-white w-[80%] text-center py-0 my-0">
                    Please kindly set your new password.
                  </span>
                  <div className="w-full">
                    <label htmlFor="password" className="text-gray-700">
                      New password
                    </label>
                    <div className="bg-white/60 w-full rounded-full p-3 px-4 my-1 flex items-center justify-between">
                      <Field
                        type={isVisible ? "text" : "password"}
                        name="newPassword"
                        onChange={(e) =>
                          setFieldValue("newPassword", e.target.value)
                        }
                        value={values.newPassword}
                        placeholder="*************"
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
                    {errors.newPassword && touched.newPassword && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.newPassword}
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <label htmlFor="password" className="text-gray-700">
                      Re-enter password
                    </label>
                    <div className="bg-white/60 w-full rounded-full p-3 px-4 my-1 flex items-center justify-between">
                      <Field
                        type={isConfirmVisible ? "text" : "password"}
                        name="confirmPassword"
                        onChange={(e) =>
                          setFieldValue("confirmPassword", e.target.value)
                        }
                        value={values.confirmPassword}
                        placeholder="*************"
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
                    className="text-white w-full rounded-full my-2 outline-none border-none p-2 cursor-pointer bg-gradient-to-r from-[#6D31ED] to-[#3E1C87] hover:opacity-90"
                  >
                    Reset
                  </button>
                </Form>
              )}
            </Formik>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center gap-2">
              <h2 className="font-bold text-3xl text-[#6D31ED] my-0 py-0">
                Password changed!
              </h2>
              <span className="text-[13px] text-white w-[80%] text-center py-0 my-0">
                You've Successfully Completed Your Password Reset!
              </span>
              <button
                onClick={() => navigate("/login")}
                className="text-white w-full rounded-full my-6 outline-none border-none p-2 cursor-pointer bg-gradient-to-r from-[#6D31ED] to-[#3E1C87] hover:opacity-90"
              >
                Log In Now
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
