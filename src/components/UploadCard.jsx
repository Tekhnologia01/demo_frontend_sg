import { useSelector } from "react-redux";
import { formatSize } from "../utils/formatSize";
import { FaCheckCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useState, memo } from "react";
import { useImageUploader } from "../hooks/useImageUploader";
import { createSelector } from "@reduxjs/toolkit";

const selectFolderUploads = createSelector(
    [(state, folderId) => state.upload.folders[folderId]],
    (folder) => ({
        uploads: Array.isArray(folder?.uploads) ? folder.uploads : [],
        isUploading: folder?.isUploading || false,
        isCompleted: folder?.isCompleted || false,
        hasPausedUploads: Array.isArray(folder?.uploads) && folder.uploads.some((u) => u.status === "paused")
    })
);

const UploadCard = ({ folderId, setIsConfirmOpen, setDeleteFolderId }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { uploads, isUploading, isCompleted, hasPausedUploads } = useSelector((state) =>
        selectFolderUploads(state, folderId)
    );

    const {
        startAll,
        pauseAll,
        cancelAll,
        startUpload,
        pauseUpload,
        retryUpload,
        cancelUpload
    } = useImageUploader(folderId);

    const totalUploads = uploads.length;
    const totalCompleted = uploads.filter((u) => u.status === "success").length;

    const toggleCard = () => {
        setIsExpanded((prev) => !prev);
    };

    const handleCancelAll = () => {
        if (isCompleted) {
            cancelAll(folderId)
        } else {
            setDeleteFolderId(folderId)
            setIsConfirmOpen(true)
        }
    }

    if (!totalUploads) return null;

    return (
        <>
            <div className="border border-gray-200 rounded-lg shadow-sm">
                <div
                    className="flex justify-between items-center p-2 bg-gray-50 cursor-pointer"
                    onClick={toggleCard}
                >
                    <h3 className="text-sm font-semibold text-gray-700">
                        Folder ID: {folderId}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">
                            {totalCompleted} of {totalUploads} completed
                        </span>
                        {isExpanded ? <BsChevronUp size={14} /> : <BsChevronDown size={14} />}
                    </div>
                </div>
                {isExpanded && (
                    <div className="p-2 space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                {!isCompleted && (
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded transition cursor-pointer"
                                        onClick={() => {
                                            if (isUploading) {
                                                pauseAll(folderId);
                                            } else {
                                                startAll(folderId);
                                            }
                                        }}
                                    >
                                        {isUploading ? "Pause" : hasPausedUploads ? "Resume" : "Upload"}
                                    </button>
                                )}
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded transition cursor-pointer"
                                    onClick={handleCancelAll}
                                >
                                    {isUploading ? "Cancel" : "Clear"}
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 minimal-scrollbar overflow-y-auto max-h-[150px] space-y-2">
                            {uploads.map((upload) => (
                                <div
                                    key={upload.id}
                                    className="p-2 border border-gray-200 rounded-lg flex items-center justify-between gap-2 shadow-sm"
                                >
                                    <div className="flex-grow flex flex-col gap-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 text-[13px] text-gray-700">
                                            <span
                                                className="font-medium truncate max-w-[70%]"
                                                title={upload.name}
                                            >
                                                {upload.name}
                                            </span>
                                            <span className="text-[11px] text-gray-500 whitespace-nowrap">
                                                {formatSize(upload?.file?.size || upload?.size || 0)}
                                            </span>
                                        </div>
                                        <div className="w-full h-[6px] bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
                                                style={{ width: `${upload.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {upload.status === "pending" && (
                                            <button
                                                className="bg-green-500 hover:bg-green-600 transition cursor-pointer text-white text-[11px] px-2 py-1 rounded"
                                                onClick={() => startUpload(upload)}
                                            >
                                                Upload
                                            </button>
                                        )}
                                        {["queued", "getting_sas", "uploading", "notifying"].includes(upload.status) && (
                                            <button
                                                className="bg-yellow-500 hover:bg-yellow-600 transition cursor-pointer text-white text-[11px] px-2 py-1 rounded"
                                                onClick={() => pauseUpload(upload)}
                                            >
                                                Pause
                                            </button>
                                        )}
                                        {["paused", "error"].includes(upload.status) && (
                                            <button
                                                className="bg-green-500 hover:bg-green-600 transition cursor-pointer text-white text-[11px] px-2 py-1 rounded"
                                                onClick={() => retryUpload(upload)}
                                            >
                                                {upload.status === "paused" ? "Resume" : "Retry"}
                                            </button>
                                        )}
                                        <button
                                            className={`${upload.status !== "success" ? "text-red-500 hover:text-red-600" : "text-green-500 hover:text-green-600"} transition cursor-pointer text-[16px] px-1 rounded-full`}
                                            onClick={() => {
                                                upload.status !== "success" && cancelUpload(upload);
                                            }}
                                        >
                                            {upload.status !== "success" ? (
                                                <RxCross2 size={18} />
                                            ) : (
                                                <FaCheckCircle size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default memo(UploadCard);