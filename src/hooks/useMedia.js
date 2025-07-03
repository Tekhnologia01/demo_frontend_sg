import { useQuery } from "@tanstack/react-query";
import axiosClient from "../services/axiosInstance";
import { createQueryConfig } from "../utils/queryConfigFactory";

const fetchMedia = async (folderId, currentPage, limitPerPage, searchTerm) => {
    const response = await axiosClient.get("/media", {
        params: {
            folderId: folderId,
            page: currentPage,
            limit: limitPerPage,
            search: searchTerm ?? ""
        }
    });
    return response.data;
};

export const useMedia = (
    folderId,
    currentPage = 1,
    limitPerPage = 10,
    searchTerm = null
) => {
    return useQuery(
        createQueryConfig({
            queryKey: ["media-main", currentPage, searchTerm, folderId],
            queryFn: () => fetchMedia(folderId, currentPage, limitPerPage, searchTerm),
            enabled: !!folderId
        })
    );
};