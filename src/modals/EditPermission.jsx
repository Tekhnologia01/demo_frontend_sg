import React, { useEffect, useRef, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import Searchbar from "../components/Common/Searchbar";
import { FaAngleDown } from "react-icons/fa6";
import { CiSaveUp2 } from "react-icons/ci";
import { useFolderUser } from "../hooks/useFolderUser";
import { useSelector } from "react-redux";
import { decrypt } from "../services/decrypt";
import { Formik, Form, Field } from "formik";
import toast from "react-hot-toast";
import axiosClient from "../services/axiosInstance";

const roleKeys = ["view", "edit", "share", "is_deleted"];

const EditPermission = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const buttonRefs = useRef({});
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { currentFolderId } = useSelector((state) => state.folder);
  const { data: foldersData, refetch } = useFolderUser(currentFolderId ?? "");

  const toggleDropdown = (userId) => {
    setOpenDropdownId((prevId) => (prevId === userId ? null : userId));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSave = async (folderId, userId, values) => {
    const payload = {
      view: values.view ? 1 : 0,
      edit: values.edit ? 1 : 0,
      share: values.share ? 1 : 0,
      is_deleted: values.is_deleted ? 1 : 0,
    };

    await toast.promise(
      axiosClient.put(
        `/folder/folder-permission/${folderId}?userId=${userId}`,
        payload
      ),
      {
        loading: "Permission updating...",
        success: (res) => {
          setOpenDropdownId(null);
          refetch();
          return res?.data?.message || "Permissions updated";
        },
        error: (err) =>
          err?.response?.data?.message || "Failed to update permissions",
      }
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !Object.values(buttonRefs.current).some((ref) =>
          ref?.contains(event.target)
        )
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={handleBackdropClick}
    >
      <div className={`bg-white w-full max-w-[550px] rounded-xl shadow-lg flex flex-col transform transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
        <div className="w-full p-4 bg-[#F5F1FE] flex justify-between items-center rounded-t-xl">
          <h2 className="text-[#6D31ED] text-2xl font-bold px-2">
            Edit Permission
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 p-1 hover:text-black text-xl"
          >
            <RxCross1 />
          </button>
        </div>

        <div className="p-4">
          <Searchbar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            title=""
            placeholder="Search name, group and email"
          />

          <div className="my-4">
            {foldersData?.data?.users?.length > 0 ? foldersData?.data?.users
              ?.filter((user) =>
                decrypt(user?.user_name)
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((user) => {
                const userId = user.user_id;

                return (
                  <Formik
                    key={userId}
                    enableReinitialize
                    initialValues={{
                      view: Boolean(user?.folder_permission?.view),
                      edit: Boolean(user?.folder_permission?.edit),
                      share: Boolean(user?.folder_permission?.share),
                      is_deleted: Boolean(user?.folder_permission?.is_deleted),
                    }}
                    onSubmit={(values) =>
                      handleSave(currentFolderId, userId, values)
                    }
                  >
                    <Form>
                      <div className="border-y-[1px] border-y-[#DEE1E6] p-2 relative flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <img
                            src={decrypt(user?.user_photo_path)}
                            alt="user"
                            className="w-12 h-12 rounded-full"
                          />
                          <h4 className="font-bold text-md">
                            {decrypt(user?.user_name)}
                          </h4>
                        </div>

                        <div
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => toggleDropdown(userId)}
                          ref={(el) => (buttonRefs.current[userId] = el)}
                        >
                          <FaAngleDown className="text-xl font-semibold" />
                        </div>

                        {openDropdownId === userId && (
                          <div
                            className="absolute right-0 top-12 w-48 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                            ref={dropdownRef}
                          >
                            {roleKeys.map((role) => (
                              <Field name={role} key={role}>
                                {({ field }) => (
                                  <label className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-gray-100">
                                    <input
                                      type="checkbox"
                                      {...field}
                                      checked={field.value}
                                      className="accent-blue-500"
                                    />
                                    <span className="capitalize">{role}</span>
                                  </label>
                                )}
                              </Field>
                            ))}

                            <hr className="text-[#E8E8E8] my-1" />

                            <button
                              type="submit"
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-100 cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <CiSaveUp2 size={16} /> Save Changes
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    </Form>
                  </Formik>
                );
              }) :
              <p className="text-center text-gray-600">No user added</p>
            }
          </div>
        </div>
      </div >
    </div >
  );
};

export default EditPermission;
