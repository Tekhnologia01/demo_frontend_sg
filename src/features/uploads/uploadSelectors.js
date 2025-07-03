export const selectUploads = (state, folderId) => state.upload.folders?.[folderId]?.uploads || [];

export const selectIsUploading = (state, folderId) => state.upload.folders?.[folderId]?.isUploading || false;

export const selectIsCompleted = (state, folderId) => state.upload.folders?.[folderId]?.isCompleted || false;

export const selectTotalUploads = (state, folderId) => state.upload.folders?.[folderId]?.uploads?.length || 0;

export const selectTotalCompleted = (state, folderId) =>
    state.upload.folders?.[folderId]?.uploads?.reduce(
        (count, u) => (u.status === "success" ? count + 1 : count),
        0
    ) || 0;

export const selectHasPausedUploads = (state, folderId) =>
    state.upload.folders?.[folderId]?.uploads?.some(u => u.status === "paused") || false;