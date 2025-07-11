import { RxCross1, RxCross2 } from "react-icons/rx";
import { FaCheck, FaFolder } from "react-icons/fa6";
import { Field, Formik, Form } from "formik";
import { useState, useRef, useEffect } from "react";
import Profile from "../assets/profile.jpg";
import axiosClient from "../services/axiosInstance";
import { decrypt } from "../services/decrypt";
import Spinner from "../components/common/Spinner";
import { createQueryConfig } from "../utils/queryConfigFactory";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { TiGroup } from "react-icons/ti";

const folderColors = [
  "#FFD156",
  "#F23B31",
  "#F6722A",
  "#00A254",
  "#00948E",
  "#2880CB",
  "#A759C2",
  "#DA49B0",
  "#D9D9D9",
  "#FFBCB4",
  "#FFC08B",
  "#7AD596",
  "#68D2CD",
  "#83C6F3",
  "#DEABF2",
  "#FFA6E4",
];

const limitPerPage = 6;

const CreateFolder = ({
  isOpen,
  onClose,
  callback,
  folderData,
  parentFolderId,
  isEdit = false,
}) => {
  // if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const searchTermRef = useRef("");

  const { currentFolderId } = useSelector((state) => state.folder);

  const fetchFolders = async () => {
    const response = await axiosClient.get(`/folder?search=${searchTerm}`);
    return response.data;
  };

  // const { data: allFolders, refetch } = useQuery({
  //   queryKey: ["all-folders", currentFolderId],
  //   queryFn: () => fetchFolders(),
  //   keepPreviousData: false,
  //   cacheTime: 0,
  //   staleTime: 0,
  // });

  const fetchGroups = async () => {
    const response = await axiosClient.get(
      `/group/get?limit=${limitPerPage}&page=${currentPage}&search=${searchTerm}`
    );
    return response.data;
  };

  const fetchFolderUsers = async () => {
    const response = await axiosClient.get(`/folder/users/${currentFolderId}`);
    return response?.data?.data || [];
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      searchTermRef.current = "";
      setSearchTerm("");
      setFetchedUsers([]);
      setFetchingUsers(false);
      setFilteredItems([]);
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

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <Formik
        initialValues={{
          parentFolder: parentFolderId ?? null,
          folderName:
            isEdit && folderData?.folder_name
              ? decrypt(folderData?.folder_name)
              : "",
          folderColor:
            isEdit && folderData?.folder_color
              ? decrypt(folderData?.folder_color)
              : "",
          isAdvanced: false,
          addType: "user",
          userIds: [],
          circleIds: [],
          folderIds: [],
        }}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          if (values?.userIds?.length > 0)
            values.userIds = values?.userIds?.map((user) => user.user_id);
          await callback(values, resetForm);
          setSubmitting(false);
        }}
      >
        {({ handleSubmit, setFieldValue, values }) => {
          const folderQueryConfig = createQueryConfig({
            queryKey: ["folders-main", currentPage, searchTerm],
            queryFn: fetchFolders,
            enabled: values.addType === "folder",
          });

          const groupQueryConfig = createQueryConfig({
            queryKey: ["groups", currentPage, searchTerm],
            queryFn: fetchGroups,
            enabled: values.addType === "circle",
          });

          const folderUserQueryConfig = createQueryConfig({
            queryKey: ["folder-user", currentFolderId, isEdit],
            queryFn: fetchFolderUsers,
            keepPreviousData: false,
            cacheTime: 0,
            staleTime: 0,
            enabled: isEdit,
          });

          const {
            data: groupData,
            isLoading: isGroupsLoading,
            isError: isGroupsError,
            isFetching: isGroupsFetching,
          } = useQuery(groupQueryConfig);

          const {
            data: foldersData,
            isLoading: isFoldersLoading,
            isError: isFoldersError,
            isFetching: isFoldersFetching,
          } = useQuery(folderQueryConfig);

          const {
            data: folderUsersData,
            isLoading: isFolderUsersLoading,
            isError: isFolderUsersError,
            isFetching: isFolderUsersFetching,
          } = useQuery(folderUserQueryConfig);

          useEffect(() => {
            if (
              isEdit &&
              folderUsersData &&
              !isFolderUsersLoading &&
              !isFolderUsersError
            ) {
              setFieldValue("userIds", folderUsersData?.users ?? []);
              setFieldValue("isAdvanced", !!folderUsersData?.users?.length);
            }
          }, [
            folderUsersData,
            isFolderUsersLoading,
            isFolderUsersError,
            isEdit,
            setFieldValue,
          ]);

          const handleSearch = (value, addType) => {
            if (value?.length <= 10) {
              searchTermRef.current = value;
              setSearchTerm(value);
              if (addType === "user") {
                fetchUserByMobile(value);
                setFilteredItems([]);
              }
            }
          };

          useEffect(() => {
            let data = [];
            if (values.addType === "folder" && foldersData?.data) {
              data = foldersData.data;
            } else if (values.addType === "circle" && groupData?.data) {
              data = groupData.data;
            }

            if (searchTerm.trim()) {
              data = data.filter((item) =>
                item.name?.toLowerCase().includes(searchTerm.toLowerCase())
              );
            }
            setFilteredItems(data);
          }, [foldersData, groupData, searchTerm, values.addType]);

          useEffect(() => {
            handleSearch("", "user");
          }, []);

          const filteredUsers = fetchedUsers?.filter(
            (user) => !values?.userIds?.some((u) => u?.user_id === user?.user_id)
          );

          return (
            <Form
              onSubmit={handleSubmit}
              className={`bg-white w-full max-w-[550px] rounded-xl shadow-lg flex flex-col transform transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full p-4 bg-[#F5F1FE] flex justify-between items-center rounded-t-xl">
                <h2 className="text-[#6D31ED] text-2xl font-bold px-2">
                  {isEdit ? "Edit" : "Create a"} Folder
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    searchTermRef.current = "";
                    setSearchTerm("");
                    setFetchedUsers([]);
                    setFetchingUsers(false);
                    setFilteredItems([]);
                    onClose();
                  }}
                  className="text-gray-600 p-1 hover:text-black text-xl cursor-pointer"
                  aria-label="Close"
                >
                  <RxCross1 />
                </button>
              </div>

              <div className="p-4 w-full flex flex-col gap-2">
                <label
                  htmlFor="folderName"
                  className="px-1 text-sm text-gray-700 font-medium"
                >
                  Folder Name
                </label>
                <Field
                  id="folderName"
                  name="folderName"
                  placeholder="Enter folder name"
                  className="border border-[#6D31ED] shadow-sm rounded-full w-full p-2 px-4 outline-0"
                />
              </div>

              <label
                htmlFor="folderColor"
                className="px-5 text-sm text-gray-700 font-medium"
              >
                Folder color
              </label>
              <div className="flex flex-wrap gap-4 py-3 px-5 items-center justify-between">
                {folderColors.map((color) => (
                  <div
                    key={color}
                    className={`rounded-full cursor-pointer border-2 hover:border-slate-300 flex items-center justify-center ${values.folderColor === color
                      ? "border-slate-300"
                      : "border-transparent"
                      }`}
                    style={{ padding: "1px" }}
                    onClick={() => setFieldValue("folderColor", color)}
                  >
                    <div
                      className="h-[40px] w-[40px] rounded-full flex items-center justify-center"
                      style={{ backgroundColor: color }}
                    ></div>
                  </div>
                ))}
              </div>

              {values.isAdvanced && (
                <div className="px-4 mb-2 mt-2 w-full flex flex-col justify-around gap-2">
                  <Field
                    as="select"
                    name="addType"
                    className="p-1 rounded border-0 outline-0 w-30"
                    onChange={(e) => {
                      setFieldValue("addType", e.target.value);
                      searchTermRef.current = "";
                      setSearchTerm("");
                      setFetchedUsers([]);
                      setFetchingUsers(false);
                      setFilteredItems([]);
                      handleSearch("", e.target.value);
                    }}
                  >
                    <option value="user">Add user</option>
                    <option value="circle">Add group</option>
                    <option value="folder">Add folder</option>
                  </Field>

                  <input
                    type={values.addType === "user" ? "number" : "text"}
                    value={searchTermRef.current}
                    onChange={(e) =>
                      handleSearch(e.target.value, values.addType)
                    }
                    placeholder={
                      values.addType === "user"
                        ? "Enter 10 digit mobile number to search"
                        : `Search ${values.addType}s...`
                    }
                    className="border border-[#6D31ED] shadow-sm rounded-full w-full p-2 px-4 outline-0"
                  />

                  <div className="px-2 flex flex-col gap-2 max-h-60 overflow-y-auto">
                    {values.addType === "user" && fetchingUsers ? (
                      <div className="py-2">
                        <Spinner size={36} />
                      </div>
                    ) : values.addType === "user" &&
                      searchTermRef?.current?.length === 10 ? (
                      filteredUsers?.length > 0 ? (
                        filteredUsers.map((user) => (
                          <div
                            key={user.user_id}
                            className="flex justify-between items-center p-2 hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={decrypt(user.user_photo_path) || Profile}
                                className="w-10 h-10 rounded-full"
                                alt={decrypt(user.user_name)}
                              />
                              <div>
                                <div className="font-medium">
                                  {decrypt(user.user_name)}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {"+91 " + decrypt(user.user_mobile_no)}
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="px-3 py-1 border rounded-full cursor-pointer"
                              onClick={() => {
                                setFieldValue("userIds", [
                                  ...values.userIds,
                                  user,
                                ]);
                                searchTermRef.current = "";
                                setSearchTerm("");
                              }}
                            >
                              + Add
                            </button>
                          </div>
                        ))
                      ) : fetchedUsers?.length > 0 ? (
                        <p className="text-center text-gray-500">
                          User already added to folder.
                        </p>
                      ) : (
                        <p className="text-center text-gray-500">
                          No user found
                        </p>
                      )
                    ) : values.addType !== "user" &&
                      (isFoldersLoading ||
                        isGroupsLoading ||
                        isFoldersFetching ||
                        isGroupsFetching) ? (
                      <div className="py-2">
                        <Spinner size={36} />
                      </div>
                    ) : values.addType !== "user" &&
                      filteredItems?.length > 0 ? (
                      filteredItems?.map(
                        (item) =>
                          item.folder_folder_id !== currentFolderId && (
                            <div
                              key={
                                values.addType === "circle"
                                  ? item.group_id
                                  : item.folder_folder_id
                              }
                              className="flex justify-between items-center p-2 hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                                {/* {values.addType === "circle" && (
                              <Grown
                                src={decrypt(item.group_photo) || Profile}
                                className="w-10 h-10 rounded-full"
                                alt={decrypt(item.group_name)}
                              />
                            )} */}
                                <div>
                                  <div className="font-medium flex items-center gap-2">
                                    {values.addType !== "folder" ? (
                                      <>
                                        {" "}
                                        <TiGroup size={22} />{" "}
                                        {decrypt(item.group_name)}
                                      </>
                                    ) : (
                                      <>
                                        {" "}
                                        <FaFolder size={22} />
                                        {decrypt(item.folder_folder_name)}{" "}
                                      </>
                                    )}
                                  </div>
                                  {values.addType === "circle" && (
                                    <div className="text-sm text-gray-500">
                                      Total Users: {item.member_count}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {(values.addType === "folder" &&
                                values.folderIds.includes(
                                  item.folder_folder_id
                                )) ||
                                (values.addType === "circle" &&
                                  values.circleIds.includes(item.group_id)) ? (
                                <div className="flex items-center gap-3">
                                  <span className="text-green-600 flex items-center gap-1">
                                    <FaCheck /> Added
                                  </span>
                                  <button
                                    type="button"
                                    className="text-gray-400 hover:text-black"
                                    onClick={() => {
                                      if (values.addType === "folder") {
                                        setFieldValue(
                                          "folderIds",
                                          values.folderIds.filter(
                                            (fid) =>
                                              fid !== item.folder_folder_id
                                          )
                                        );
                                      } else if (values.addType === "circle") {
                                        setFieldValue(
                                          "circleIds",
                                          values.circleIds.filter(
                                            (cid) => cid !== item.group_id
                                          )
                                        );
                                      }
                                    }}
                                  >
                                    <RxCross2 className="cursor-pointer" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  className="px-3 py-1 border rounded-full cursor-pointer"
                                  onClick={() => {
                                    if (values.addType === "folder") {
                                      setFieldValue("folderIds", [
                                        ...values.folderIds,
                                        item.folder_folder_id,
                                      ]);
                                    } else if (values.addType === "circle") {
                                      setFieldValue("circleIds", [
                                        ...values.circleIds,
                                        item.group_id,
                                      ]);
                                    }
                                  }}
                                >
                                  + Add
                                </button>
                              )}
                            </div>
                          )
                      )
                    ) : values.addType !== "user" ? (
                      <p className="text-center text-gray-500">
                        No {values.addType}s found
                      </p>
                    ) : null}

                    {values.addType === "user" && values.userIds.length > 0 && (
                      <>
                        <hr className="mt-2 border-gray-200" />
                        <p className="text font-semibold text-[#6D31ED]">
                          Added Users
                        </p>
                        {isEdit && isFolderUsersLoading ? (
                          <div className="py-2">
                            <Spinner size={36} />
                          </div>
                        ) : isEdit && isFolderUsersError ? (
                          <p className="text-center text-red-500">
                            Error loading folder users
                          </p>
                        ) : (
                          values.userIds.map((user) => (
                            <div
                              key={user.user_id}
                              className="flex justify-between items-center p-2 hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={decrypt(user.user_photo_path) || Profile}
                                  className="w-10 h-10 rounded-full"
                                  alt={decrypt(user.user_name)}
                                />
                                <div>
                                  <div className="font-medium">
                                    {decrypt(user.user_name)}
                                  </div>
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
                                      "userIds",
                                      values.userIds.filter(
                                        (u) => u.user_id !== user.user_id
                                      )
                                    )
                                  }
                                >
                                  <RxCross2 className="cursor-pointer" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 p-4">
                {!values.isAdvanced && (
                  <button
                    type="button"
                    onClick={() => {
                      setFieldValue("isAdvanced", true);
                      handleSearch("", "user");
                    }}
                    className="p-2 sm:w-1/4 w-1/3 rounded-full cursor-pointer text-[#3E1C87] border border-[#3E1C87]"
                  >
                    Advance
                  </button>
                )}
                <button
                  type="submit"
                  className="p-2 sm:w-1/4 w-1/3 rounded-full cursor-pointer text-white bg-gradient-to-r from-[#6D31ED] to-[#3E1C87] hover:opacity-90"
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

export default CreateFolder;
