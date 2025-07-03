import { useQuery } from "@tanstack/react-query"
import { createQueryConfig } from "../utils/queryConfigFactory"
import axiosClient from "../services/axiosInstance"

const fetchFolderUsers = async (folder_id)=>{
  try {  
    const response = await axiosClient.get(`folder/users/${folder_id}`)
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}

export const useFolderUser = (
    folderId=null
) => {
    return useQuery(createQueryConfig({
        queryKey: ["folder-user",folderId],
        queryFn: () => fetchFolderUsers(folderId),
        enabled: !!folderId,
    }))
}