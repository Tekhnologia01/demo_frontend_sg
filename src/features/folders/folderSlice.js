import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentFolderId: null,
    breadcrumbs: [],
};

const replaceFolder = (folders, updatedFolder) => folders.map(folder => folder.folder_id === updatedFolder.folder_id ? updatedFolder : folder);

const folderSlice = createSlice({
    name: "folder",
    initialState,
    reducers: {
        goToFolder: (state, action) => {
            const folder = action.payload;
            state.currentFolderId = folder.folder_id;
            state.breadcrumbs.push(folder);
        },
        goToBreadcrumb: (state, action) => {
            const index = action.payload;
            const newTrail = state.breadcrumbs.slice(0, index + 1);
            state.breadcrumbs = newTrail;
            state.currentFolderId = newTrail[index]?.folder_id || null;
        },
        resetToRoot: (state) => {
            state.currentFolderId = null;
            state.breadcrumbs = [];
        },
        updateBreadCrumb: (state, action) => {
            const updatedFolder = action.payload;
            state.breadcrumbs = replaceFolder(state.breadcrumbs, updatedFolder);
        }
    },
});

export const { goToFolder, goToBreadcrumb, resetToRoot, updateBreadCrumb } = folderSlice.actions;

export default folderSlice.reducer;