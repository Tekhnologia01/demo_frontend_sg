import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { VscChromeMinimize } from "react-icons/vsc";
import { useImageUploader } from "../hooks/useImageUploader";
import { formatSize } from "../utils/formatSize";
import { FaCheckCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import ConfirmationModal from "./ConfirmationModal";
import { RxCrossCircled } from "react-icons/rx";

const UploadMedia = ({ isOpen, onClose }) => {

    if (!isOpen) return null;

    const fileInputRef = useRef();
    const { currentFolderId } = useSelector((state) => state.folder);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const {
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
    } = useImageUploader(currentFolderId);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleFileChange = (e) => {
        enqueueImages([...e.target.files], currentFolderId);
        e.target.value = null;
    };

    const handleGlobalUploadToggle = () => {
        if (isUploading) {
            pauseAll(currentFolderId);
        } else {
            startAll(currentFolderId);
        }
    };

    const handleCancelAll = () => {
        if (isCompleted) {
            cancelAll(currentFolderId)
        } else {
            setIsConfirmOpen(true)
        }
    }

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur-xs p-4"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-white w-full max-w-[700px] rounded-xl shadow-lg flex flex-col max-h-[100vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full p-4 bg-[#F5F1FE] flex justify-between items-center rounded-t-xl">
                    <h2 className="text-[#6D31ED] text-2xl font-bold px-2">Upload Images</h2>
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="text-gray-600 hover:text-black cursor-pointer">
                            <VscChromeMinimize size={22} />
                        </button>
                        <button onClick={onClose} className="text-gray-600 hover:text-red-600 text-xl cursor-pointer">
                            <RxCross1 />
                        </button>
                    </div>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                />

                <div className={`p-4 flex ${uploads.length > 0 ? "justify-between" : "justify-center"} gap-4 shrink-0`}>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition cursor-pointer"
                        onClick={() => fileInputRef.current.click()}
                    >
                        {uploads.length > 0 ? "Add Images" : "Select Images"}
                    </button>
                    {uploads.length > 0 && (
                        <div className="flex items-center gap-4">
                            {
                                !isCompleted && <button
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md cursor-pointer transition"
                                    onClick={handleGlobalUploadToggle}
                                >
                                    {isUploading ? "Pause" : hasPausedUploads ? "Resume" : "Upload"}
                                </button>
                            }
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer transition"
                                onClick={handleCancelAll}
                            >
                                {isUploading ? "Cancel" : "Clear"}
                            </button>
                        </div>
                    )}
                </div>

                {uploads.length > 0 && (
                    <div className="w-full px-4 mb-2">
                        <div className="w-full h-[10px] bg-gray-300 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-300"
                                style={{
                                    width: `${Math.round((totalCompleted / totalUploads) * 100)}%`,
                                }}
                            />
                        </div>
                        <div className="text-sm text-gray-600 mt-1 text-right">
                            {totalCompleted} of {totalUploads} completed
                        </div>
                    </div>
                )}

                {uploads.length > 0 && (
                    <div className="px-4 pb-4 overflow-y-auto max-h-[70vh] space-y-2">
                        {uploads.map((upload) => (
                            <div
                                key={upload.id}
                                className="p-3 border border-gray-200 rounded-lg flex items-center justify-between gap-4 shadow-sm"
                            >
                                <div className="flex-grow flex flex-col gap-2 min-w-0">
                                    <div className="flex items-center justify-between gap-3 text-[15px] text-gray-700">
                                        <span
                                            className="font-medium truncate max-w-[90%]"
                                            title={upload.name}
                                        >
                                            {upload.name}
                                        </span>
                                        <span className="text-[13px] text-gray-500 whitespace-nowrap">
                                            {formatSize(upload?.file?.size || upload?.size || 0)}
                                        </span>
                                    </div>
                                    <div className="w-full h-[8px] bg-gray-200 rounded-full overflow-hidden mt-1">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
                                            style={{ width: `${upload.progress}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {upload.status === "pending" && (
                                        <button
                                            className="bg-green-500 hover:bg-green-600 transition cursor-pointer text-white text-[13px] px-[10px] py-[6px] rounded"
                                            onClick={() => startUpload(upload)}
                                        >
                                            Upload
                                        </button>
                                    )}
                                    {["queued", "getting_sas", "uploading", "notifying"].includes(upload.status) && (
                                        <button
                                            className="bg-yellow-500 hover:bg-yellow-600 transition cursor-pointer text-white text-[13px] px-[10px] py-[6px] rounded"
                                            onClick={() => pauseUpload(upload)}
                                        >
                                            Pause
                                        </button>
                                    )}
                                    {["paused", "error"].includes(upload.status) && (
                                        <button
                                            className="bg-green-500 hover:bg-green-600 transition cursor-pointer text-white text-[13px] px-[10px] py-[6px] rounded"
                                            onClick={() => retryUpload(upload)}
                                        >
                                            {upload.status === "paused" ? "Resume" : "Retry"}
                                        </button>
                                    )}
                                    <button
                                        className={`${upload.status !== "success" ? "text-red-500 hover:text-red-600" : "text-green-500 hover:text-green-600"} transition cursor-pointer text-[18px] px-2 py-1 rounded-full`}
                                        onClick={() => {
                                            upload.status !== "success" && cancelUpload(upload)
                                        }}
                                    >
                                        {

                                            upload.status !== "success" ? <RxCross2 size={24} /> : <FaCheckCircle size={24} />
                                        }

                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                callbackFn={() => cancelAll(currentFolderId)}
                message={"Are you sure to cancel all uploads?"}
                icon={<RxCrossCircled size={46} color='gray' />}
            />
        </div>
    );
};

export default UploadMedia;