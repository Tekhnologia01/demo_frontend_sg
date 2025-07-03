import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Searchbar from "../components/Common/Searchbar";
import FolderCard from "../components/FolderCard";
import { HiOutlineDotsVertical, HiOutlineHome } from "react-icons/hi";
import { FiChevronRight } from "react-icons/fi";
import { FaAngleDown, FaPlus } from "react-icons/fa6";
import CreateFolder from "../modals/CreateFolder";
import toast from "react-hot-toast";
import axiosClient from "../services/axiosInstance";
import Spinner from "../components/common/Spinner";
import Pagination from "../components/common/Pagination";
import { decrypt } from "../services/decrypt";
import {
  goToBreadcrumb,
  goToFolder,
  resetToRoot,
  updateBreadCrumb,
} from "../features/folders/folderSlice";
import { useFolder } from "../hooks/useFolder";
import { useMedia } from "../hooks/useMedia";
import MasonryLayout from "../components/Common/MasonryLayout";
import { useQueryClient } from "@tanstack/react-query";
import EditPermission from "../modals/EditPermission";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../modals/ConfirmationModal";
import { RiDeleteBin6Line } from "react-icons/ri";
import UploadMedia from "../modals/UploadMedia";
import { memo } from "react";
import MediaApproval from "../components/MediaApproval";

const limitPerPage = 150;

const FolderPage = () => {
  const queryClient = useQueryClient();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [folderPage, setFolderPage] = useState(1);
  const [mediaPage, setMediaPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showMediaDropdown, setShowMediaDropdown] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isSelect, setIsSelect] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contextFolder, setContextFolder] = useState(null);

  const [isRequestVisible, setIsRequestVisible] = useState(false);

  const addDropdownRef = useRef();
  const settingsDropdownRef = useRef();
  const mediaDropdownRef = useRef();

  const dispatch = useDispatch();
  const { currentFolderId, breadcrumbs } = useSelector((state) => state.folder);

  const CustomContextMenu = useCallback(
    ({ x, y, folder, onClose }) => {
      setContextFolder(folder);
      useEffect(() => {
        const handleClick = () => onClose();
        const handleEscape = (e) => e.key === "Escape" && onClose();
        document.addEventListener("click", handleClick);
        document.addEventListener("keydown", handleEscape);
        return () => {
          document.removeEventListener("click", handleClick);
          document.removeEventListener("keydown", handleEscape);
          // setContextFolder(null);
        };
      }, [onClose]);

      return (
        <div
          className="absolute z-50 w-40 bg-white rounded shadow border border-gray-200"
          style={{ top: y, left: x }}
        >
          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Open</div>
          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            Rename
          </div>
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </div>
        </div>
      );
    },
    [dispatch]
  );

  const navigate = useNavigate();

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    folder: null,
  });

  const {
    data: foldersData,
    isLoading: isFoldersLoading,
    isError: isFoldersError,
    refetch: foldersRefetch,
    isFetching: isFoldersFetching,
  } = useFolder(currentFolderId, folderPage, limitPerPage, searchTerm);

  const {
    data: mediaData,
    isLoading: isMediaLoading,
    isError: isMediaError,
    refetch: mediaRefetch,
    isFetching: isMediaFetching,
  } = useMedia(currentFolderId, mediaPage, limitPerPage, searchTerm);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!addDropdownRef.current?.contains(e.target))
        setShowAddDropdown(false);
      if (!settingsDropdownRef.current?.contains(e.target))
        setShowSettingsDropdown(false);
      if (!mediaDropdownRef.current?.contains(e.target))
        setShowMediaDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setFolderPage(1);
    setMediaPage(1);
  }, [currentFolderId]);

  const handleFolderClick = useCallback(
    (folder) => {
      dispatch(goToFolder(folder));
    },
    [dispatch]
  );

  const handleBreadcrumbClick = (index) => {
    dispatch(goToBreadcrumb(index));
  };

  const handleResetToRoot = () => {
    dispatch(resetToRoot());
  };

  const handleFolderDelete = async () => {
    return toast.promise(
      axiosClient.delete(`folder/delete-folder/${contextFolder?.folder_id}`),
      {
        loading: "Deleting folder...",
        success: (res) => {
          foldersRefetch();
          setContextFolder(null);
          dispatch(resetToRoot());
          return res?.data?.message || "Folder deleted successfully";
        },
        error: (err) => {
          return err?.response?.data?.message || "Failed to delete folder";
        },
      }
    );
  };

  const handleFolderRightClick = useCallback(
    (e, folder) => {
      e.preventDefault();
      setContextMenu({ visible: true, x: e.pageX, y: e.pageY, folder });
    },
    [dispatch]
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const createFolder = async (payload, resetForm) => {
    return toast.promise(axiosClient.post("/folder/create-folder", payload), {
      loading: "Creating folder...",
      success: (res) => {
        resetForm();
        closeModal();
        foldersRefetch();
        return res.data.message || "Folder created successfully!";
      },
      error: (err) => err.response?.data?.message || "Failed to create folder.",
    });
  };

  const updateFolder = async (payload, resetForm) => {
    return toast.promise(
      axiosClient.put(`folder/update-folder/${currentFolderId}`, payload),
      {
        loading: "Updating folder....",
        success: (res) => {
          resetForm();
          closeModal();
          foldersRefetch();
          dispatch(
            updateBreadCrumb({
              folder_id: currentFolderId,
              folder_name: payload?.folderName,
              folder_color: payload?.folderColor,
            })
          );
          queryClient.invalidateQueries({
            queryKey: [
              "folder-main",
              breadcrumbs.length < 2
                ? "root"
                : breadcrumbs[breadcrumbs.length - 2]?.folder_id,
            ],
            exact: false,
          });
          return "Folder updated Successfully";
        },
        error: (err) => {
          return err.response?.data?.message || "Failed to update folder";
        },
      }
    );
  };

  const folders = foldersData?.data || [];
  const totalFolders = foldersData?.totalRecords || 0;
  const media = mediaData?.data || [];
  // const totalMedia = mediaData?.totalRecords || 0;

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="flex flex-col gap-8 w-full max-w-7xl">
          {/* Search Bar */}
          <div className="flex items-center justify-center px-10 sm:px-20 md:px-40 lg:px-50 xl:px-60 mt-4">
            <Searchbar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder={"Search with folder name"}
            />
          </div>

          {/* Breadcrumbs and Action Buttons */}
          <div className="flex items-center justify-between px-4 flex-wrap">
            <div className="px-4 py-2 flex flex-wrap items-center gap-1 text-gray-600">
              <button
                onClick={()=>{
                  handleResetToRoot();
                  setIsRequestVisible(false);
                }}
                className={`font-medium flex items-center gap-1 hover:text-[#6D31ED] transition cursor-pointer ${
                  !breadcrumbs.length && "text-black"
                }`}
              >
                <HiOutlineHome size={18} className="mb-[3px]" />
                Home
              </button>

              {breadcrumbs.map((crumb, idx) => (
                <div key={crumb.folder_id} className="flex items-center gap-1">
                  <FiChevronRight className="text-gray-400" />
                  <button
                    onClick={() => {
                      handleBreadcrumbClick(idx); setIsRequestVisible(false)
                    }}
                    className={`font-medium hover:text-[#6D31ED] transition cursor-pointer ${
                      idx === breadcrumbs.length - 1 && "text-black"
                    }`}
                  >
                    {decrypt(crumb.folder_name)}
                  </button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              {/* + Dropdown */}
              <div className="relative" ref={addDropdownRef}>
                <div
                  className="w-fit cursor-pointer p-2.5 outline-0 rounded-full text-white bg-gradient-to-r from-[#3E1C87] to-[#6D31ED] hover:opacity-90 shadow-sm hover:shadow-md transition"
                  onClick={() => setShowAddDropdown((prev) => !prev)}
                >
                  <FaPlus size={20} />
                </div>
                {showAddDropdown && (
                  <div className="absolute w-[140px] right-0 top-12 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-51 overflow-hidden">
                    <div
                      className="p-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setIsEdit(false);
                        openModal();
                      }}
                    >
                      Create Folder
                    </div>
                    {currentFolderId && (
                      <div
                        className="p-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setShowAddDropdown(false);
                          // navigate('/upload');
                          setIsUploadModalOpen(true);
                        }}
                      >
                        Upload Images
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Settings Dropdown */}
              {currentFolderId && (
                <div className="relative" ref={settingsDropdownRef}>
                  <div
                    className="flex justify-center items-center gap-1 w-fit cursor-pointer p-2 px-5 outline-0 rounded-full text-white bg-gradient-to-r from-[#3E1C87] to-[#6D31ED] hover:opacity-90 shadow-sm hover:shadow-md transition"
                    onClick={() => setShowSettingsDropdown((prev) => !prev)}
                  >
                    Settings
                    <FaAngleDown size={20} />
                  </div>
                  {showSettingsDropdown && (
                    <div className="absolute w-[140px] right-0 top-12 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-100 overflow-hidden">
                      <div
                        className="p-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setIsEdit(true);
                          openModal();
                        }}
                      >
                        Edit Folder
                      </div>
                      {/* <div
                      className="p-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Delete Folder
                    </div> */}
                      {
                        <div
                          className="p-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setShowSettingsDropdown(false);
                            openEditModal();
                          }}
                        >
                          Permissions
                        </div>
                      }

                      <div
                        className="p-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setShowSettingsDropdown(false);
                          setIsRequestVisible(true);
                        }}
                      >
                        Media Requests
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {!isRequestVisible ? (
            <>
              {/* ===== Folder Section ===== */}
              <section className="px-4">
                {!!breadcrumbs.length && (
                  <h2 className="text-lg text-gray-700 font-semibold mb-2">
                    Folders
                  </h2>
                )}
                <div className="flex items-center flex-wrap justify-center gap-4">
                  {isFoldersLoading || isFoldersFetching ? (
                    <Spinner size={36} />
                  ) : isFoldersError ? (
                    <p className="text-red-500">Failed to load folders</p>
                  ) : folders.length > 0 ? (
                    folders.map((folder) => (
                      <FolderCard
                        data={folder}
                        key={folder.folder_id}
                        onClick={handleFolderClick}
                        onRightClick={handleFolderRightClick}
                      />
                    ))
                  ) : (
                    <p>No folders found</p>
                  )}
                </div>

                {totalFolders > 0 && totalFolders > limitPerPage && (
                  <Pagination
                    currentPage={folderPage}
                    limitPerPage={limitPerPage}
                    totalRecords={foldersData?.totalRecords}
                    onPageChange={setFolderPage}
                  />
                )}
              </section>

              {/* ===== Media Section ===== */}
              {!!breadcrumbs.length && !!media.length && (
                <section className="px-4">
                  <div className="w-full flex justify-between items-center">
                    <h2 className="text-lg text-gray-700 font-semibold mb-2">
                      Media
                    </h2>
                    <div
                      className="relative cursor-pointer"
                      ref={mediaDropdownRef}
                    >
                      <HiOutlineDotsVertical
                        size={22}
                        onClick={() => setShowMediaDropdown(true)}
                      />
                      {showMediaDropdown && (
                        <div className="absolute w-[140px] right-0 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-51 overflow-hidden">
                          <div
                            className="p-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setIsSelect(true);
                              setShowMediaDropdown(false);
                            }}
                          >
                            Delete Images
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-around items-center gap-4">
                    {isMediaLoading || isMediaFetching ? (
                      <Spinner size={36} />
                    ) : isMediaError ? (
                      <p className="text-red-500">Failed to load media</p>
                    ) : media.length > 0 ? (
                      <MasonryLayout
                        initialPhotos={media?.map((item) =>
                          decrypt(item?.media_thumb_url)
                        )}
                        selectable={isSelect}
                      />
                    ) : (
                      <p>No media available</p>
                    )}
                  </div>
                </section>
              )}
            </>
          ) : (
            <MediaApproval onBack={() => setIsRequestVisible(false)}/>
          )}
        </div>
      </div>

      {contextMenu.visible && (
        <CustomContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          folder={contextMenu.folder}
          onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        />
      )}

      {/* Create Folder Modal */}
      <CreateFolder
        isOpen={isModalOpen}
        onClose={closeModal}
        callback={isEdit ? updateFolder : createFolder}
        parentFolderId={!isEdit ? currentFolderId || null : null}
        isEdit={isEdit}
        folderData={
          isEdit
            ? breadcrumbs?.find(
                (data) => data?.folder_id === currentFolderId
              ) || {}
            : {}
        }
      />

      <EditPermission
        isOpen={isEditModalOpen}
        onClose={() => closeEditModal()}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        callbackFn={handleFolderDelete}
        message={"Are you sure to delete this folder?"}
        icon={<RiDeleteBin6Line size={46} color="gray" />}
      />

      <UploadMedia
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        folderId={currentFolderId}
      />
    </>
  );
};

export default memo(FolderPage);
