import { useRef } from "react";
import { useImageUploader } from "../hooks/useImageUploader";
import { useSelector } from "react-redux";

const UploadPage = () => {
    const fileInputRef = useRef();
    const {
        enqueueImages,
        startAll,
        pauseAll,
        cancelAll,
        startUploadById,
        pauseUploadById,
        retryUpload,
        cancelUploadById,
        pendingUploads,
        isUploading,
        hasPausedUploads,
    } = useImageUploader();
    const { currentFolderId } = useSelector(state => state.folder);

    const handleFileChange = (e) => {
        enqueueImages([...e.target.files], currentFolderId);
        e.target.value = null;
    };

    const handleGlobalUploadToggle = () => {
        if (isUploading) {
            pauseAll();
        } else {
            startAll();
        }
    };

    return (
        <div className="p-4 space-y-4">
            <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                hidden
                onChange={handleFileChange}
            />
            <div className="flex space-x-4">
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => fileInputRef.current.click()}
                >
                    Select Images
                </button>
                {pendingUploads.length > 0 && (
                    <>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded"
                            onClick={handleGlobalUploadToggle}
                        >
                            {isUploading ? "Pause" : hasPausedUploads ? "Resume" : "Upload"}
                        </button>
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded"
                            onClick={cancelAll}
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>

            {pendingUploads.length > 0 && (
                <div className="space-y-2">
                    {pendingUploads.map((upload) => (
                        <div
                            key={upload.id}
                            className="p-2 border rounded flex items-center justify-between"
                        >
                            <div>
                                <p className="font-medium">{upload.name}</p>
                                <p className="text-sm text-gray-500">
                                    {upload.status} - {upload.progress}%
                                    {upload.error && <span className="text-red-500"> - {upload.error}</span>}
                                </p>
                            </div>
                            <div className="space-x-2 flex items-center">
                                {upload.status === "pending" && (
                                    <button
                                        className="bg-green-500 text-white px-2 py-1 rounded"
                                        onClick={() => startUploadById(upload)}
                                    >
                                        Upload
                                    </button>
                                )}
                                {(upload.status === "queued" || upload.status === "getting_sas" || upload.status === "uploading" || upload.status === "notifying") && (
                                    <button
                                        className="bg-yellow-600 text-white px-2 py-1 rounded"
                                        onClick={() => pauseUploadById(upload.id)}
                                    >
                                        Pause
                                    </button>
                                )}
                                {(upload.status === "paused" || upload.status === "error") && (
                                    <button
                                        className="bg-green-500 text-white px-2 py-1 rounded"
                                        onClick={() => retryUpload(upload)}
                                    >
                                        {upload.status === "paused" ? "Resume" : "Retry"}
                                    </button>
                                )}
                                <button
                                    className="bg-red-600 text-white px-2 py-1 rounded"
                                    onClick={() => cancelUploadById(upload.id)}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UploadPage;