import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import {
    addUpload,
    updateUpload,
    removeUpload,
    startAllUploads,
    pauseAllUploads,
    cancelAllUploads,
    setIsUploading,
} from "../features/uploads/uploadSlice";
import { selectUploads, selectIsUploading, selectHasPausedUploads, selectIsCompleted, selectTotalCompleted, selectTotalUploads } from "../features/uploads/uploadSelectors";
import axiosClient from "../services/axiosInstance";
import toast from "react-hot-toast";
import store from "../store/store";

const uploadControllers = {};

export const useImageUploader = (folderId) => {
    const dispatch = useDispatch();
    const uploads = useSelector((state) => selectUploads(state, folderId));
    const isUploading = useSelector((state) => selectIsUploading(state, folderId));
    const hasPausedUploads = useSelector((state) => selectHasPausedUploads(state, folderId));
    const isCompleted = useSelector((state) => selectIsCompleted(state, folderId));
    const totalUploads = useSelector((state) => selectTotalUploads(state, folderId));
    const totalCompleted = useSelector((state) => selectTotalCompleted(state, folderId));

    const enqueueImages = (files, folderId) => {
        files.forEach((file) => {
            const id = uuidv4();
            dispatch(addUpload({ id, file, folderId }));
        });
    };

    const uploadSingleImage = async (upload) => {
        const { id, file, folderId, checkpoint, progress = 0 } = upload;
        try {
            const controller = new AbortController();
            if (!uploadControllers[folderId]) {
                uploadControllers[folderId] = {};
            }
            uploadControllers[folderId][id] = controller;

            let sasUrl, blobName;

            if (checkpoint?.stage === "notifying") {
                ({ sasUrl, blobName } = checkpoint);
                dispatch(updateUpload({ folderId, id, updates: { status: "notifying", progress: 95 } }));
            } else if (checkpoint?.stage === "uploading") {
                ({ sasUrl, blobName } = checkpoint);
                dispatch(updateUpload({ folderId, id, updates: { status: "uploading", progress } }));
            } else {
                dispatch(updateUpload({ folderId, id, updates: { status: "getting_sas", checkpoint: { stage: "getting_sas" }, progress: 5 } }));

                const { data } = await axiosClient.post(
                    "/media/generate-url",
                    {
                        mediaName: file.name,
                        mediaSize: file.size,
                        mediaFolderId: folderId,
                        mediaType: "image",
                    },
                    { signal: controller.signal }
                );

                ({ sasUrl, blobName } = data?.data);

                dispatch(updateUpload({ folderId, id, updates: { status: "uploading", checkpoint: { stage: "uploading", sasUrl, blobName, }, progress: Math.max(progress, 10) } }));
            }

            if (checkpoint?.stage !== "notifying") {
                await axios.put(sasUrl, file, {
                    headers: {
                        "x-ms-blob-type": "BlockBlob",
                        "Content-Type": file.type || "application/octet-stream",
                    },
                    signal: controller.signal,
                    onUploadProgress: (event) => {
                        const uploadedRatio = event.loaded / event.total;
                        const adjustedProgress = Math.round(10 + uploadedRatio * 80);
                        if (adjustedProgress > progress) {
                            dispatch(updateUpload({ folderId, id, updates: { progress: adjustedProgress > 90 ? 90 : adjustedProgress } }));
                        }
                    },
                });

                dispatch(updateUpload({ folderId, id, updates: { status: "notifying", checkpoint: { stage: "notifying", sasUrl, blobName, }, progress: 95 } }));
            }

            await axiosClient.post(
                "/media/verify-url",
                {
                    mediaFolderId: folderId,
                    mediaBlobName: blobName,
                    mediaType: "image",
                },
                { signal: controller.signal }
            );

            delete uploadControllers[id];

            dispatch(updateUpload({ folderId, id, updates: { status: "success", progress: 100 } }));

            const latestUploads = selectUploads(store.getState(), folderId);
            const allCompleted = latestUploads.length > 0 && latestUploads.every(u => u.status === "success");

            if (allCompleted) {
                setTimeout(() => {
                    toast.success(`Upload completed for folder ${folderId}`);
                }, 500);
            }

        } catch (error) {
            if (error.name === "CanceledError" || axios.isCancel?.(error)) {
                dispatch(updateUpload({ folderId, id, updates: { status: "paused", error: null } }));
            } else {
                dispatch(updateUpload({ folderId, id, updates: { status: "error", error: error.message } }));
            }
        }
    };

    const startAll = async (folderId) => {
        dispatch(startAllUploads({ folderId }));
        await new Promise(resolve => setTimeout(resolve, 0));
        const eligibleUploads = uploads.filter(
            ({ status }) => status === "queued" || status === "pending" || status === "paused" || status === "error"
        );
        if (eligibleUploads.length === 0) {
            return;
        }
        await Promise.allSettled(
            eligibleUploads.map(upload => {
                return uploadSingleImage(upload);
            })
        );
    };

    const pauseAll = (folderId) => {
        const folderControllers = uploadControllers[folderId] || {};
        Object.values(folderControllers).forEach(controller => controller.abort());
        dispatch(pauseAllUploads({ folderId }));
    };

    const cancelAll = (folderId) => {
        const folderControllers = uploadControllers[folderId] || {};
        Object.values(folderControllers).forEach(controller => controller.abort());
        delete uploadControllers[folderId];
        dispatch(cancelAllUploads({ folderId }));
    };

    const startUpload = async (upload) => {
        dispatch(setIsUploading({ folderId: upload.folderId, uploading: true }));
        dispatch(updateUpload({ folderId: upload.folderId, id: upload.id, updates: { status: "queued" } }));
        await uploadSingleImage(upload);
    };

    const pauseUpload = (upload) => {
        const controller = uploadControllers[upload.folderId]?.[upload.id];
        if (controller) {
            controller.abort();
            dispatch(updateUpload({ folderId: upload.folderId, id: upload.id, updates: { status: "paused", error: null } }));
        }
    };

    const retryUpload = async (upload) => {
        dispatch(setIsUploading({ folderId: upload.folderId, uploading: true }));
        dispatch(updateUpload({ folderId: upload.folderId, id: upload.id, updates: { status: "queued" } }));
        await uploadSingleImage(upload);
    };

    const cancelUpload = (upload) => {
        if (uploadControllers[folderId]?.[upload.id]) {
            uploadControllers[folderId][upload.id].abort();
            delete uploadControllers[folderId][upload.id];
        }
        dispatch(removeUpload({ folderId: upload.folderId, id: upload.id }));
    };

    return {
        enqueueImages,
        startAll,
        pauseAll,
        cancelAll,
        startUpload,
        pauseUpload,
        retryUpload,
        cancelUpload,
        uploads,
        isUploading,
        isCompleted,
        hasPausedUploads,
        totalUploads,
        totalCompleted
    };
};