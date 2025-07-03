import { useQuery } from "@tanstack/react-query";
import axiosClient from "../services/axiosInstance";
import { createQueryConfig } from "../utils/queryConfigFactory";

const fetchFolders = async (folderId, currentPage, limitPerPage, searchTerm) => {
    const response = await axiosClient.get("/media/folder", {
        params: {
            folderId: folderId ?? "",
            page: currentPage,
            limit: limitPerPage,
            search: searchTerm ?? ""
        }
    });
    return response.data;
};

export const useFolder = (
    folderId = null,
    currentPage = 1,
    limitPerPage = 10,
    searchTerm = null
) => {
    return useQuery(
        createQueryConfig({
            queryKey: ["folder-main", folderId ?? "root", currentPage, searchTerm],
            queryFn: () => fetchFolders(folderId, currentPage, limitPerPage, searchTerm)
        })
    );
};