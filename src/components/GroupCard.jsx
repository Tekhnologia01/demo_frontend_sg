import React, { useEffect, useRef, useState } from 'react';
import { FiPlus } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import ConfirmationModal from '../modals/ConfirmationModal';
import { RiDeleteBin6Line } from "react-icons/ri";
import { decrypt } from '../services/decrypt';
import axiosClient from '../services/axiosInstance';
import GroupModal from '../modals/GroupModal';
import toast from 'react-hot-toast';

const GroupCard = ({ data, refetch }) => {
    const { group_id, group_name, member_count, group_photo, member_photos } = data;

    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [groupData, setGroupData] = useState(null);

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

    const fetchGroupInfo = async (group_id) => {
        try {
            if (group_id) {
                const response = await axiosClient.get(`/group/group-info/${group_id}`)
                return response.data.data;
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleEditClick = async () => {
        const response = await fetchGroupInfo(group_id);
        setGroupData(response);
        setIsEditModalOpen(true);
    };

    const handleEditGroup = async (payload, resetForm, resetFormState) => {
        const groupData = {
            ...payload,
            groupMembers: payload.groupMembers.map((m) => m.user_id)
        };

        return toast.promise(
            axiosClient.put("/group/update-group", groupData, {
                headers: { "Content-Type": "multipart/form-data" },
            }),
            {
                loading: "Updating group...",
                success: (res) => {
                    resetForm();
                    resetFormState();
                    setIsEditModalOpen(false);
                    refetch();
                    return res.data.message || "Group updated successfully!";
                },
                error: (err) =>
                    err.response?.data?.message || "Failed to update group.",
            }
        );
    };

    const handleDeleteGroup = async () => {
        return toast.promise(
            axiosClient.delete(`/group/delete/${group_id}`),
            {
                loading: "Deleting group...",
                success: (res) => {
                    refetch();
                    return res.data.message || "Group deleted successfully!";
                },
                error: (err) =>
                    err.response?.data?.message || "Failed to delete group.",
            }
        );
    }

    return (
        <div
            className={`relative w-56 p-4 rounded-2xl bg-white border-2 border-gray-200 hover:border-purple-400 transition duration-300 shadow-md hover:shadow-purple-300 ${!isEditModalOpen ? "cursor-pointer" : ""}`}
            onMouseEnter={(e) =>
                e.currentTarget.style.boxShadow = "0 0 10px 4px rgba(204, 155, 213, 0.2)"
            }
            onMouseLeave={(e) =>
                e.currentTarget.style.boxShadow = "none"
            }
            style={{ userSelect: 'none' }}
        >
            <div className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={toggleDropdown} ref={buttonRef}>
                <BsThreeDotsVertical />
            </div>

            <div className="flex justify-center">
                <img
                    src={decrypt(group_photo)}
                    alt="group-icon"
                    className="w-24 h-24 rounded-full object-cover"
                />
            </div>

            <p className="text-center font-semibold text-lg mt-2">{decrypt(group_name)}</p>

            {/* Participant images + + icon */}
            <div className="flex items-center justify-center mt-3 -space-x-4">
                {Array.isArray(member_photos) && member_photos.length > 0 && member_photos.slice(0, 3).map((img, index) => (
                    <img
                        key={index}
                        src={decrypt(img)}
                        alt={`participant-${index}`}
                        className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    />
                ))}
                <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-purple-600">
                    <FiPlus />
                </div>
            </div>

            <p className="text-center text-gray-500 text-sm mt-2">
                {member_count} Participant{member_count !== 1 ? 's' : ''}
            </p>

            {isDropdownOpen && (
                <div className="absolute right-4 top-9 w-32 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden" ref={dropdownRef}>
                    <button
                        onClick={handleEditClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                        <div className="flex gap-2 items-center">
                            <MdEdit size={18} />
                            <span>Edit</span>
                        </div>
                    </button>
                    <button
                        onClick={() => {
                            setIsDeleteModalOpen(true);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100 cursor-pointer"
                    >
                        <div className="flex gap-2 items-center">
                            <MdDelete size={18} />
                            <span>Delete</span>
                        </div>
                    </button>
                </div>
            )}

            <GroupModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                isEdit={true}
                groupData={{ ...groupData, groupId: group_id }}
                callBack={handleEditGroup}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                callbackFn={handleDeleteGroup}
                message={"Are you sure to delete this group?"}
                icon={<RiDeleteBin6Line size={46} color='gray' />}
            />
        </div>
    );
};

export default React.memo(GroupCard);