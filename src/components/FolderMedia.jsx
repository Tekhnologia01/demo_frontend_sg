import React, { useEffect, useRef, useState } from "react";
import MatchedImages from "./MatchedImages";
import FaceImage from "./FaceImage";
import { FaFolderClosed, FaAngleDown } from "react-icons/fa6";
import { GoPlusCircle } from "react-icons/go";
import AddModal from "../modals/AddModal";
import EditPermission from "../modals/EditPermission";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import CreateFolder from "../modals/CreateFolder";

const FolderMedia = () => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFolderModalOpen,setIsFolderModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openFolderModal = () => setIsFolderModalOpen(true);
  const closeFolderModal = () => setIsFolderModalOpen(false);

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="ms-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <div className="hover:bg-purple-100 rounded-full p-2 cursor-pointer transition" onClick={() => navigate(-1)}>
              <IoArrowBackOutline size={30} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">Ganesha Festive Photos</span>
              <span className="font-semibold text-[#6D31ED]">100 Images</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <button className="w-fit cursor-pointer p-2 px-5 outline-0 rounded-full text-white bg-gradient-to-r from-[#3E1C87] to-[#6D31ED] hover:opacity-90 shadow-sm hover:shadow-md transition">+ Upload</button>
            </div>
            <div onClick={toggleDropdown} className="relative" ref={buttonRef}>
              <button className="w-fit cursor-pointer p-2 px-5 outline-0 rounded-full text-white bg-gradient-to-r from-[#3E1C87] to-[#6D31ED] hover:opacity-90 shadow-sm hover:shadow-md transition flex items-center gap-2">Settings <FaAngleDown /> </button>
              {isDropdownOpen && (
                <div
                  className="absolute right-0 top-12 w-40 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden"
                  ref={dropdownRef}
                >
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => openModal()}
                  >
                    <div
                      className="flex gap-2 items-center">
                      <span>Add User</span>
                    </div>
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => openEditModal()}
                  >
                    <div className="flex gap-2 items-center">
                      <span>Edit Permission</span>
                    </div>
                  </button>
                   <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => openFolderModal()}
                  >
                    <div
                      className="flex gap-2 items-center">
                      <span>Edit Folder</span>
                    </div>
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => openEditModal()}
                  >
                    <div className="flex gap-2 items-center">
                      <span>Delete Folder</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-24">
        <FaceImage />
      </div>
      <MatchedImages />

      <AddModal
        isOpen={isModalOpen}
        onClose={() => closeModal()}
      />

      <EditPermission
        isOpen={isEditModalOpen}
        onClose={() => closeEditModal()}
      />

      <CreateFolder
        isOpen={isFolderModalOpen}
        onClose={() => closeFolderModal()}
      />
    </div>
  );
};

export default FolderMedia;
