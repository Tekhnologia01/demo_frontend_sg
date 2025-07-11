import { RxCross1, RxCross2 } from "react-icons/rx";
import { IoCamera } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Formik, Form } from "formik";
import { useEffect, useRef, useState } from "react";
import Searchbar from "../components/Common/Searchbar";
import EmojiInput from "../components/common/EmojiInput";
import axiosClient from "../services/axiosInstance";
import Spinner from "../components/common/Spinner";
import { decrypt } from "../services/decrypt";
import { createGroupSchema } from "../validationSchema/createGroupSchema";
import { MdEdit } from "react-icons/md";

const GroupModal = ({ isOpen, onClose, callBack, groupData, isEdit = false }) => {
  // if (!isOpen) return null;

  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const excelRef = useRef();
  const photoRef = useRef();
  const searchTermRef = useRef("");

  const [photoPreview, setPhotoPreview] = useState(null);

  const [excelName, setExcelName] = useState("");

  useEffect(() => {
  if (isEdit && groupData?.group_photo) {
    setPhotoPreview(decrypt(groupData.group_photo));
  }
}, [isEdit, groupData]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      resetLocalState();
      onClose();
    }
  };

  const fetchUserByMobile = async (mobile) => {
    if (mobile.length !== 10) {
      setFetchedUsers([]);
      return;
    }
    try {
      setFetchingUsers(true);
      const response = await axiosClient(`/user/search?mobile=${mobile}`);
      setFetchedUsers(response.data.data || []);
    } catch (err) {
      console.error("Error fetching user:", err);
      setFetchedUsers([]);
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleSearch = (value) => {
    if (value.length <= 10) {
      searchTermRef.current = value;
      fetchUserByMobile(value);
    }
  };

  const resetLocalState = () => {
    searchTermRef.current = "";
    setFetchedUsers([]);
    setFetchingUsers(false);
    setPhotoPreview(null);
    setExcelName("");
    if (photoRef.current) photoRef.current.value = "";
    if (excelRef.current) excelRef.current.value = "";
  };

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={handleBackdropClick}
    >
      <Formik
        enableReinitialize
        initialValues={{
          groupName: isEdit && groupData?.group_name != "" ? decrypt(groupData?.group_name) : "",
          groupMembers: isEdit && groupData?.group_members ? groupData.group_members : [],
          excelFile: null,
          groupPhoto: null,
          groupCheck: "",
        }}
        validationSchema={createGroupSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          await callBack({ ...values, groupId: groupData?.groupId }, resetForm, resetLocalState);
          setSubmitting(false);
        }}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched, submitCount }) => {
          // setPhotoPreview(isEdit && groupData?.group_photo ? decrypt(groupData.group_photo) : null)
          const handlePhotoChange = (e) => {
            const file = e.currentTarget.files[0];
            if (file) {
              setFieldValue("groupPhoto", file);
              setPhotoPreview(URL.createObjectURL(file));
            }
          };

          const handleExcelChange = (e) => {
            const file = e.currentTarget.files[0];
            if (file) {
              setFieldValue("excelFile", file);
              setExcelName(file.name);
            }
          };

          const clearPhoto = () => {
            setFieldValue("groupPhoto", null);
            setPhotoPreview(null);
            if (photoRef.current) photoRef.current.value = "";
          };

          const clearExcel = () => {
            setFieldValue("excelFile", null);
            setExcelName("");
            if (excelRef.current) excelRef.current.value = "";
          };

          const filteredUsers = fetchedUsers?.filter(
            (user) => !values.groupMembers?.some((u) => u.user_id === user.user_id)
          );

          const handleAddUser = (user) => {
            setFieldValue("groupMembers", [...values.groupMembers, user]);
            searchTermRef.current = "";
            setFetchedUsers([]);
          };

          return (
            <Form
              className={`bg-white w-full max-w-[550px] rounded-xl shadow-lg transform transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="w-full p-4 bg-[#F5F1FE] flex justify-between items-center rounded-t-xl">
                <h2 className="text-[#6D31ED] text-2xl font-bold px-2">{isEdit ? "Edit Group" : "Create a Group"}</h2>
                <button
                  type="button"
                  onClick={() => {
                    resetLocalState();
                    onClose();
                  }}
                >
                  <RxCross1 className="text-xl text-gray-600 hover:text-black cursor-pointer" />
                </button>
              </div>

              {/* Photo & Name */}
              <div className="p-4 w-full flex justify-around gap-1 items-center">
                <div className="flex flex-col items-center cursor-pointer relative">
                  {photoPreview ? (
                    <>
                      <div className="w-18 h-18">
                        <img
                        src={photoPreview}
                        alt="Profile Preview"
                        className="w-full h-full rounded-full object-cover border border-gray-400"
                      />
                      </div>
                      <button
                        type="button"
                        onClick={isEdit ? () => photoRef.current.click() : clearPhoto}
                        className="absolute top-0 right-0 bg-white rounded-full p-1 text-gray-600 hover:text-purple-600 cursor-pointer"
                        aria-label="Edit photo"
                      >
                        {isEdit ? <MdEdit /> : <RxCross2 />}
                      </button>
                    </>
                  ) : (
                    <div
                      onClick={() => photoRef.current.click()}
                      className="w-16 h-16 flex justify-center items-center rounded-full border border-gray-400"
                    >
                      <IoCamera className="text-3xl text-gray-400" />
                    </div>
                  )}
                  <input
                    ref={photoRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </div>

                <div className="w-full">
                  <EmojiInput
                    placeholder="Name your group"
                    inputText={values.groupName}
                    setInputText={(val) => setFieldValue("groupName", val)}
                    inputClasses="border-0 border-b-1 px-3 border-b-[#B08BFF]"
                  />
                  {errors.groupName && touched.groupName && (
                    <div className="text-red-500 text-sm px-4">{errors.groupName}</div>
                  )}
                </div>
              </div>

              {/* Search & Upload */}
              <div className="p-4">
                <Searchbar
                  type="number"
                  searchTerm={searchTermRef.current}
                  setSearchTerm={handleSearch}
                  placeholder="Enter 10 digit mobile number to search"
                />
                {!isEdit && (
                  <div className="flex flex-col justify-center items-center my-2">
                    <span className="text-[#6D31ED]">OR</span>
                    {!values.excelFile && (
                      <div
                        onClick={() => excelRef.current.click()}
                        className="border border-gray-400 rounded-full px-4 py-2 my-2 cursor-pointer hover:bg-purple-200 transition"
                      >
                        <span className="flex items-center gap-2">
                          <AiOutlineCloudUpload size={18} /> Upload excel
                        </span>
                      </div>
                    )}
                    <input
                      ref={excelRef}
                      type="file"
                      accept=".xlsx,.xls"
                      className="hidden"
                      onChange={handleExcelChange}
                    />
                    {excelName && (
                      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full mt-2 max-w-full">
                        <span className="text-gray-700 truncate max-w-[200px]">{excelName}</span>
                        <button
                          type="button"
                          onClick={clearExcel}
                          className="text-gray-600 hover:text-red-600"
                          aria-label="Remove excel file"
                        >
                          <RxCross2 className="cursor-pointer" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {errors.groupCheck && submitCount > 0 && (
                  <div className="text-red-500 text-sm text-center mt-2">
                    {errors.groupCheck}
                  </div>
                )}
              </div>

              {/* Fetched Users */}
              <div className="px-4 flex flex-col gap-2 max-h-60 overflow-y-auto">
                {fetchingUsers ? (
                  <div className="py-2">
                    <Spinner size={36} />
                  </div>
                ) : searchTermRef.current.length === 10 ? (
                  filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div
                        key={user.user_id}
                        className="flex justify-between items-center p-2 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={decrypt(user.user_photo_path)}
                            className="w-12 h-12 rounded-full"
                            alt={decrypt(user.user_name)}
                          />
                          <div>
                            <div className="font-medium">{decrypt(user.user_name)}</div>
                            <div className="text-sm text-gray-500">
                              {"+91 " + decrypt(user.user_mobile_no)}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="px-3 py-1 border rounded-full cursor-pointer"
                          onClick={() => handleAddUser(user)}
                        >
                          + Add
                        </button>
                      </div>
                    ))
                  ) : fetchedUsers.length > 0 ? (
                    <p className="text-center text-gray-500">User already added to group.</p>
                  ) : (
                    <p className="text-center text-gray-500">No user found</p>
                  )
                ) : null}

                {/* Added Users */}
                {values.groupMembers?.length > 0 && (
                  <>
                    <hr className="mt-2 border-gray-200" />
                    <p className="text- font-semibold text-[#6D31ED]">Added Members</p>
                    {values.groupMembers.map((user) => (
                      <div
                        key={user.user_id}
                        className="flex justify-between items-center p-2 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={decrypt(user.user_photo_path)}
                            className="w-10 h-10 rounded-full"
                            alt={decrypt(user.user_name)}
                          />
                          <div>
                            <div className="font-medium">{decrypt(user.user_name)}</div>
                            <div className="text-sm text-gray-500">
                              {"+91 " + decrypt(user.user_mobile_no)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-green-600 flex items-center gap-1">
                            <FaCheck /> Added
                          </span>
                          <button
                            type="button"
                            className="text-gray-400 hover:text-black"
                            onClick={() =>
                              setFieldValue(
                                "groupMembers",
                                values.groupMembers.filter((u) => u.user_id !== user.user_id)
                              )
                            }
                          >
                            <RxCross2 className="cursor-pointer" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 p-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="p-2 sm:w-1/4 w-1/3 rounded-full text-white bg-gradient-to-r from-[#6D31ED] to-[#3E1C87] hover:opacity-90 transition cursor-pointer"
                >
                  {isEdit ? "Update" : "Create"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default GroupModal;