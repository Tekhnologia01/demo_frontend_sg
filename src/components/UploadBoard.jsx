import { useSelector, useDispatch } from "react-redux";
import { toggleUploadBoard } from "../features/uploads/uploadSlice";
import UploadCard from "./UploadCard";
import { createSelector } from "@reduxjs/toolkit";
import { memo, useRef, useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import ConfirmationModal from "../modals/ConfirmationModal";
import { RxCrossCircled } from "react-icons/rx";
import { useImageUploader } from "../hooks/useImageUploader";

const selectUploadState = createSelector(
    [(state) => state.upload.showUploadBoard, (state) => state.upload.folders],
    (showUploadBoard, folders) => {
        const folderIds = Object.entries(folders)
            .filter(([_, folder]) => Array.isArray(folder.uploads) && folder.uploads.length > 0)
            .map(([folderId]) => folderId);
        return { showUploadBoard, folderIds };
    }
);

const selectUploadStatus = createSelector(
    (state) => state.upload,
    (upload) => ({
        isUploading: upload.isUploading,
        isCompleted: upload.isCompleted,
    })
);

const selectUploadCounts = createSelector(
    (state) => state.upload.folders,
    (folders) => {
        let totalUploads = 0;
        let totalCompleted = 0;

        Object.values(folders).forEach((folder) => {
            if (!Array.isArray(folder.uploads)) return;
            totalUploads += folder.uploads.length;
            totalCompleted += folder.uploads.filter((u) => u.status === "success").length;
        });

        return { totalUploads, totalCompleted };
    }
);

const UploadBoard = () => {
    const dispatch = useDispatch();
    const boardRef = useRef();

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteFolderId, setDeleteFolderId] = useState("");

    const { showUploadBoard, folderIds } = useSelector(selectUploadState);
    const { isUploading, isCompleted } = useSelector(selectUploadStatus);
    const { totalUploads, totalCompleted } = useSelector(selectUploadCounts);

    const { cancelAll } = useImageUploader();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showUploadBoard && boardRef.current && !boardRef.current.contains(e.target)) {
                dispatch(toggleUploadBoard(false));
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showUploadBoard, dispatch]);

    const handleCloseConfirmModal = () => {
        setIsConfirmOpen(false);
        setDeleteFolderId("");
    }

    const handleCancelAll = () => {
        if (deleteFolderId) {
            cancelAll(deleteFolderId)
            setDeleteFolderId("");
        }
    }

    if (!totalUploads) return null;

    let statusText = "Paused";
    if (isUploading && !isCompleted) statusText = "Uploading...";
    else if (!isUploading && isCompleted) statusText = "Completed";

    const buttonColor =
        isUploading && !isCompleted
            ? "bg-yellow-500 hover:bg-yellow-600"
            : !isUploading && isCompleted
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-500 hover:bg-gray-600";

    return (
        <>
            {!showUploadBoard && (
                <button
                    className={`fixed bottom-5 right-5 ${buttonColor} text-white px-4 py-2 rounded-full shadow-lg transition z-40 cursor-pointer`}
                    onClick={() => dispatch(toggleUploadBoard(true))}
                >
                    {statusText} ({totalCompleted}/{totalUploads})
                </button>
            )}

            <div
                ref={boardRef}
                className={`fixed bottom-4 right-4 w-[350px] max-h-[60vh] bg-white rounded-xl shadow-lg flex flex-col overflow-hidden transition-transform duration-300 z-40 ${showUploadBoard ? "translate-x-0" : "translate-x-[400px]"}`}
            >
                <div className="w-full p-3 bg-[#F5F1FE] flex justify-between items-center rounded-t-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 px-2">
                        <h2 className="text-[#6D31ED] text-lg font-bold">Uploads</h2>
                        <span className="text-sm text-gray-600 font-medium">
                            ({totalCompleted} of {totalUploads} completed)
                        </span>
                    </div>

                    <button
                        className="text-gray-500 hover:text-red-600 transition cursor-pointer"
                        onClick={() => dispatch(toggleUploadBoard(false))}
                    >
                        <RxCross2 size={20} />
                    </button>
                </div>

                <div className="flex-1 hide-scrollbar overflow-y-auto p-3 space-y-3">
                    {folderIds.map((folderId) => (
                        <UploadCard key={folderId} folderId={folderId} setIsConfirmOpen={setIsConfirmOpen} setDeleteFolderId={setDeleteFolderId} />
                    ))}
                </div>
            </div>
            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={handleCloseConfirmModal}
                callbackFn={handleCancelAll}
                message={"Are you sure to cancel all uploads?"}
                icon={<RxCrossCircled size={46} color='gray' />}
            />
        </>
    );
};

export default memo(UploadBoard);