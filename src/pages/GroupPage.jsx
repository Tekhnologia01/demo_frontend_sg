import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Searchbar from "../components/Common/Searchbar";
import { VscSettings } from "react-icons/vsc";
import GroupModal from "../modals/GroupModal";
import GroupCard from "../components/GroupCard";
import toast from "react-hot-toast";
import axiosClient from "../services/axiosInstance";
import Spinner from "../components/common/Spinner";
import Pagination from "../components/common/Pagination";
import { createQueryConfig } from "../utils/queryConfigFactory";

const limitPerPage = 10;

const GroupPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const fetchGroups = async () => {
        const response = await axiosClient.get(
            `/group/get?limit=${limitPerPage}&page=${currentPage}&search=${searchTerm}`
        );
        return response.data;
    };

    const queryConfig = createQueryConfig({
        queryKey: ["groups-main", currentPage, searchTerm],
        queryFn: fetchGroups,
    });

    const { data, isLoading, isError, refetch, isFetching } = useQuery(queryConfig);

    const createGroup = async (payload, resetForm, resetFormState) => {
        const groupData = {
            ...payload,
            groupMembers: payload.groupMembers.map((m) => m.user_id)
        };

        return toast.promise(
            axiosClient.post("/group/add-group", groupData, {
                headers: { "Content-Type": "multipart/form-data" },
            }),
            {
                loading: "Creating group...",
                success: (res) => {
                    resetForm();
                    resetFormState();
                    closeModal();
                    refetch();
                    return res.data.message || "Group created successfully!";
                },
                error: (err) =>
                    err.response?.data?.message || "Failed to create group.",
            }
        );
    };

    return (
        <>
            <div className="flex items-center justify-center">
                <div className="flex flex-col gap-8 w-full max-w-7xl">
                    <div className="flex items-center justify-center px-10 sm:px-20 md:px-40 lg:px-50 xl:px-60 mt-4">
                        <Searchbar
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            placeholder={"Search with group name"}
                        />
                    </div>
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-xl font-bold text-[#565D6D]">
                            All created groups
                        </h2>
                        <div className="flex items-center gap-4">
                            <button
                                className="w-fit cursor-pointer p-2 px-5 outline-0 rounded-full text-white bg-gradient-to-r from-[#3E1C87] to-[#6D31ED] hover:opacity-90 shadow-sm hover:shadow-md transition"
                                onClick={openModal}
                            >
                                + Create group
                            </button>
                            <VscSettings size={22} className="text-[#6D31ED] cursor-pointer" />
                        </div>
                    </div>
                    <div className="flex items-center flex-wrap justify-center gap-8 px-4">
                        {isLoading || isFetching ? (
                            <Spinner size={36} />
                        ) : isError ? (
                            <p className="text-red-500">Failed to load groups</p>
                        ) : data?.data?.length > 0 ? (
                            data.data.map((group) => (
                                <GroupCard data={group} key={group.group_id} refetch={refetch} />
                            ))
                        ) : (
                            <p>No groups available</p>
                        )}
                    </div>
                </div>
            </div>

            {data?.totalRecords > limitPerPage && (
                <Pagination
                    currentPage={currentPage}
                    limitPerPage={limitPerPage}
                    totalRecords={data.totalRecords}
                    onPageChange={setCurrentPage}
                />
            )}

            <GroupModal
                isOpen={isModalOpen}
                onClose={closeModal}
                callBack={createGroup}
            />
        </>
    );
};

export default GroupPage;