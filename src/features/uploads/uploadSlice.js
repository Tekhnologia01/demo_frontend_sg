import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    folders: {},
    isUploading: false,
    isCompleted: true,
    showUploadBoard: false
};

const recalculateGlobalStatus = (state) => {
    const folders = Object.values(state.folders);

    state.isUploading = folders.some(folder => folder.isUploading);
    state.isCompleted = folders.every(folder =>
        folder.uploads.length === 0 ||
        folder.uploads.every(u => u.status === "success")
    );
};

const uploadSlice = createSlice({
    name: "upload",
    initialState,
    reducers: {
        addUpload: (state, action) => {
            const { id, file, folderId } = action.payload;

            if (!state.folders[folderId]) {
                state.folders[folderId] = {
                    uploads: [],
                    isUploading: false,
                    isCompleted: false
                }
            }

            state.folders[folderId].uploads.unshift({
                id,
                file,
                name: file.name,
                folderId,
                status: "pending",
                progress: 0,
                error: null,
                checkpoint: null,
            })

            state.folders[folderId].isCompleted = false;
            recalculateGlobalStatus(state);
        },

        updateUpload: (state, action) => {
            const { folderId, id, updates } = action.payload;
            const folder = state.folders[folderId];

            if (!folder) return;

            const upload = folder.uploads.find(u => u.id === id);

            if (upload) {
                Object.assign(upload, updates);
                folder.isUploading = !folder.uploads.every(u =>
                    ["success", "pending", "cancelled", "paused", "error"].includes(u.status)
                );
                folder.isCompleted = folder.uploads.length > 0 &&
                    folder.uploads.every(u => u.status === "success");
            }

            recalculateGlobalStatus(state);
        },

        removeUpload: (state, action) => {
            const { folderId, id } = action.payload;
            const folder = state.folders[folderId];

            if (!folder) return;

            folder.uploads = folder.uploads.filter(u => u.id !== id);
            folder.isUploading = !folder.uploads.every(u =>
                ["success", "pending", "cancelled", "paused", "error"].includes(u.status)
            );
            if (folder.uploads.length === 0) {
                folder.isCompleted = false;
            } else {
                folder.isCompleted = folder.uploads.every(u => u.status === "success");
            }

            recalculateGlobalStatus(state);
        },

        cancelAllUploads: (state, action) => {
            const { folderId } = action.payload;
            const folder = state.folders[folderId];

            if (!folder) return;

            folder.uploads = [];
            folder.isUploading = false;
            folder.isCompleted = false;

            recalculateGlobalStatus(state);
        },

        startAllUploads: (state, action) => {
            const { folderId } = action.payload;
            const folder = state.folders[folderId];

            if (!folder) return;

            folder.isUploading = true;
            folder.uploads.forEach(u => {
                if (["pending", "paused", "error"].includes(u.status)) {
                    u.status = "queued";
                }
            });

            recalculateGlobalStatus(state);
        },

        pauseAllUploads: (state, action) => {
            const { folderId } = action.payload;
            const folder = state.folders[folderId];

            if (!folder) return;

            folder.uploads.forEach(u => {
                if (["queued", "getting_sas", "uploading", "notifying"].includes(u.status)) {
                    u.status = "paused";
                }
            });
            folder.isUploading = false;

            recalculateGlobalStatus(state);
        },

        setIsUploading: (state, action) => {
            const { folderId, uploading } = action.payload;
            const folder = state.folders[folderId];

            if (!folder) return;

            folder.isUploading = uploading;

            recalculateGlobalStatus(state);
        },

        toggleUploadBoard: (state, action) => {
            state.showUploadBoard = action.payload;
        }
    },
});

export const { addUpload, updateUpload, removeUpload, cancelAllUploads, startAllUploads, pauseAllUploads, setIsUploading, toggleUploadBoard } = uploadSlice.actions;
export default uploadSlice.reducer;