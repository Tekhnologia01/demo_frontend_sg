import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../services/axiosInstance";
import { decrypt } from "../services/decrypt";
import { MdCameraAlt } from "react-icons/md";
import toast from "react-hot-toast";
import * as Yup from "yup";
import defaultProfile from "../assets/defaultProfile.jpg";
import Spinner from "../components/common/Spinner";
import ProfileBg from "../assets/profile-bg.svg";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../features/users/userSlice";

const Profile = () => {
  return (
    <>
      <div className="fixed inset-0 w-full h-full backdrop-filter brightness-60">
        <img
          src={ProfileBg}
          className="w-full h-full object-cover object-center"
        />
      </div>

      <ProfileModal isOpen={true} />
    </>
  );
};

const ProfileModal = ({ isOpen }) => {
  const {profile} = useSelector(state=> state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const [image, setImage] = useState(defaultProfile);
  const [isLoading, setIsLoading] = useState(false);


  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
        if (!allowedTypes.includes(file.type)) {
          toast.error("Only PNG, JPG, and JPEG images are allowed.");
          target.value = ""; // Reset file input
          return;
        }

        try {
          const formData = new FormData();
          formData.append("userPhoto", file);

          const response = await toast.promise(
            axiosClient.post(`/user/upload-profile-photo`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }),
            {
              loading: "Updating...",
              success: (res) => {
                
                return res?.data?.message || "Profile photo updated!";
              },
              error: (err) =>
                err?.response?.data?.message ||
                "Failed to update profile photo",
            }
          );

          // After successful upload, update with new server path if returned
          if (response?.data?.success) {
            // fetchProfile();
            dispatch(fetchProfile())
          }
        } catch (error) {
          console.error("Upload failed:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (value) => {
    try {
      const payload = {
        userName: value?.user_name,
        userMobileNo: value?.user_mobile_no,
      };

     const response = await toast.promise(axiosClient.put(`/user/update-profile`, payload), {
        loading: "Updating user profile",
        success: (res) => {
          return res?.data?.message || "User profile updated successfully";
        },
        error: (err) => {
          return err?.response?.message || "Failed to update user";
        },
      });

      if(response?.data?.success){
        dispatch(fetchProfile())
      }
    } catch (error) {}
  };

  if (isLoading) {
    return <Spinner size={36} />;
  }

  return (
    <>
      <div className="fixed inset-0 z-100 flex items-center justify-center overflow-auto">
        <div className="flex flex-col gap-6 items-center justify-center w-full max-w-3xl rounded-2xl shadow-xl p-6 bg-black/20 backdrop-blur-3xl">
          <div
            className="bg-white/80 hover:bg-purple-100 sm:mt-0 mt-24 rounded-full justify-self-start self-start p-1 cursor-pointer transition"
            onClick={() => navigate('/dashboard')}
          >
            <IoArrowBackOutline size={30} className="text-black" />
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-evenly gap-10 w-full">
            <div className="w-1/2 relative flex flex-col items-center">
              <img
                src={decrypt(profile?.user_photo_path)}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover shadow-md border-4 border-[#6D31ED]"
              />
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <MdCameraAlt
                onClick={handleIconClick}
                className="absolute bottom-[-10px] bg-white p-1 rounded-full text-[#6D31ED] text-4xl shadow-md cursor-pointer"
                title="Change Photo"
              />
            </div>
            <div className="w-full">
              <Formik
                initialValues={{
                  user_name: decrypt(profile?.user_name) || "",
                  user_email: decrypt(profile?.user_email) || "",
                  user_mobile_no: decrypt(profile?.user_mobile_no) || "",
                  aboutMe: "",
                  isEdit: false,
                }}
                validationSchema={Yup.object({
                  user_name: Yup.string().required("Name is required"),
                  user_mobile_no: Yup.string()
                    .min(10, "Mobile number shoould contain 10 digits")
                    .max(10, "Mobile number shoould contain 10 digits")
                    .matches(/^\d+$/, "Only digits are allowed")
                    .required("Mobile number is required"),
                })}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  await handleSubmit(values, resetForm);
                  setSubmitting(false);
                  values.isEdit = false;
                }}
              >
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                  <Form className="flex flex-col gap-5 w-full">
                    {!values.isEdit && (
                      <div className="w-full flex justify-end gap-4 mt-4">
                        <button
                          onClick={() => setFieldValue("isEdit", true)}
                          className="sm:w-1/3 w-1/2 rounded-full cursor-pointer bg-gradient-to-r from-[#3E1C87] to-[#6D31ED] p-3 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          Edit Profile
                        </button>
                      </div>
                    )}
                    {/* Full Name */}
                    <div className="w-full">
                      <label
                        htmlFor="user_name"
                        className="block text-sm font-semibold text-white mb-1"
                      >
                        Full Name
                      </label>
                      <Field
                        type="text"
                        name="user_name"
                        placeholder="John Doe"
                        disabled={!values?.isEdit}
                        className={`w-full rounded-lg ${
                          !values?.isEdit ? "bg-black/40" : 'border border-[#D3C3F3]'
                        }  text-white p-3 focus:ring-2 focus:ring-[#6D31ED] focus:outline-none shadow-sm`}
                      />

                      {errors?.user_name && touched?.user_name && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.user_name}
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div className="w-full">
                      <label
                        htmlFor="user_email"
                        className="block text-sm font-semibold text-white mb-1"
                      >
                        Email
                      </label>
                      <Field
                        type="email"
                        name="user_email"
                        disabled
                        placeholder="example@gmail.com"
                        className="w-full rounded-lg bg-black/40  border-0 p-3 text-white focus:ring-2 focus:ring-[#6D31ED] focus:outline-none shadow-sm"
                      />
                    </div>

                    {/* Mobile Number */}
                    <div className="w-full">
                      <label
                        htmlFor="user_mobile_no"
                        className="block text-sm font-semibold text-white mb-1"
                      >
                        Mobile Number
                      </label>
                      <Field
                        type="text"
                        name="user_mobile_no"
                        disabled={!values?.isEdit}
                        placeholder="Enter 10-digit mobile number"
                        className={`w-full rounded-lg ${
                          !values?.isEdit ? "bg-black/40" : 'border border-[#D3C3F3]'
                        }  text-white p-3 focus:ring-2 focus:ring-[#6D31ED] focus:outline-none shadow-sm`}
                      />
                      {errors.user_mobile_no && touched.user_mobile_no && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.user_mobile_no}
                        </div>
                      )}
                    </div>

                    {/* About Me */}
                    <div className="w-full">
                      <label
                        htmlFor="aboutMe"
                        className="block text-sm font-semibold text-white mb-1"
                      >
                        About Me
                      </label>
                      <Field
                        as="textarea"
                        name="aboutMe"
                        disabled
                        placeholder="Tell something about yourself"
                        className={`w-full rounded-lg bg-black/40 border border-[#D3C3F3] p-3 text-white focus:ring-2 focus:ring-[#6D31ED] focus:outline-none resize-y shadow-sm`}
                        rows="4"
                      />
                    </div>

                    {/* Buttons */}
                    {values.isEdit && (
                      <>
                        <div className="w-full flex justify-end gap-4 mt-4">
                          <button
                            type="button"
                            onClick={() => setFieldValue("isEdit", false)}
                            className="sm:w-1/3 w-1/2 rounded-full cursor-pointer border border-[#6D31ED] p-3 text-[#6D31ED] font-medium hover:bg-[#6D31ED] hover:text-white transition-all duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="sm:w-1/3 w-1/2 rounded-full cursor-pointer bg-gradient-to-r from-[#3E1C87] to-[#6D31ED] p-3 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                          >
                            Save
                          </button>
                        </div>
                      </>
                    )}
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
