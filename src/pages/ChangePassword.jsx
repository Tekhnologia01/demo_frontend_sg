import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import axiosClient from "../services/axiosInstance";
import { useSelector } from "react-redux";
import { IoEye, IoEyeOffOutline } from "react-icons/io5";

const ChangePassword = () => {
  const { accessToken } = useSelector((state) => state.token);

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Old password is required"),
    newPassword: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/,
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    )
      .min(8, "Password must be at least 8 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm your new password"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // Replace with your API call logic here
    try {
      const config = {
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      };

      await toast.promise(
        axiosClient.put(
          `${import.meta.env.VITE_API_URL}/user/update-password`,
          {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          },
          config
        ),
        {
          loading: "Updating...",
          success: (res) => {
            resetForm();
            return res?.data?.message || "Password Updated Successfully";
          },
          error: (err) => {
            return err?.response?.data?.message || "Failed to update password";
          },
        }
      );
    } catch (error) {
      console.log("Error occured : ", err);
    } finally {
    }
  };

  return (
    <div className="mt-12 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-purple-700">
          Change Password
        </h2>
        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            isOldVisible: false,
            isNewVisible: false,
            isConfirmVisible: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-5">
              <div>
                <label
                  htmlFor="oldPassword"
                  className="block text-sm font-semibold text-gray-800 mb-1"
                >
                  Old Password
                </label>
                <div className="w-full flex gap-2 justify-between px-4 py-2 rounded border border-[#D3C3F3] p-3 text-gray-800 focus:ring-2 focus:ring-[#6D31ED] focus:outline-none shadow-sm">
                  <Field
                    type={values.isOldVisible ? "text" : "password"}
                    name="oldPassword"
                    id="oldPassword"
                    placeholder="Enter old password"
                    className="w-full outline-0 border-0"
                  />
                  {values.isOldVisible ? (
                    <IoEye
                      className="cursor-pointer text-xl text-gray-700"
                      onClick={() => setFieldValue("isOldVisible", false)}
                    />
                  ) : (
                    <IoEyeOffOutline
                      className="cursor-pointer text-xl text-gray-700"
                      onClick={() => setFieldValue("isOldVisible", true)}
                    />
                  )}
                </div>

                <ErrorMessage
                  name="oldPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-semibold text-gray-800 mb-1"
                >
                  New Password
                </label>
                <div className="w-full flex gap-2 px-4 py-2 rounded border border-[#D3C3F3] p-3 text-gray-800 focus:ring-2 focus:ring-[#6D31ED] focus:outline-none shadow-sm">
                  <Field
                    type={values?.isNewVisible ? "text" : "password"}
                    name="newPassword"
                    id="newPassword"
                    placeholder="Enter new password"
                    className="w-full outline-0 border-0"
                  />
                  {values.isNewVisible ? (
                    <IoEye
                      className="cursor-pointer text-xl text-gray-700"
                      onClick={() => setFieldValue("isNewVisible", false)}
                    />
                  ) : (
                    <IoEyeOffOutline
                      className="cursor-pointer text-xl text-gray-700"
                      onClick={() => setFieldValue("isNewVisible", true)}
                    />
                  )}
                </div>

                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-800 mb-1"
                >
                  Confirm New Password
                </label>

                <div className="w-full flex gap-2 px-4 py-2 rounded border border-[#D3C3F3] p-3 text-gray-800 focus:ring-2 focus:ring-[#6D31ED] focus:outline-none shadow-sm">
                  <Field
                    type={values.isConfirmVisible ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    className="w-full outline-0 border-0"
                  />
                  {values.isConfirmVisible ? (
                    <IoEye
                      className="cursor-pointer text-xl text-gray-700"
                      onClick={() => setFieldValue("isConfirmVisible", false)}
                    />
                  ) : (
                    <IoEyeOffOutline
                      className="cursor-pointer text-xl text-gray-700"
                      onClick={() => setFieldValue("isConfirmVisible", true)}
                    />
                  )}
                </div>

                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 cursor-pointer bg-gradient-to-r from-[#6D31ED] to-[#3E1C87] hover:opacity-90 text-white rounded-md font-semibold"
              >
                {isSubmitting ? "Changing..." : "Change Password"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ChangePassword;
