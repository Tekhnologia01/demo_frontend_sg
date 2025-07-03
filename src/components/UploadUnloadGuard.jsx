import { createSelector } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const selectUploadState = createSelector(
    [(state) => state.upload.isUploading, (state) => state.upload.isCompleted],
    (isUploading, isCompleted) => ({ isUploading, isCompleted })
);

const UploadUnloadGuard = () => {
    const { isUploading, isCompleted } = useSelector(selectUploadState);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "";
        };

        if (isUploading || !isCompleted) {
            window.addEventListener("beforeunload", handleBeforeUnload);
        } else {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        }

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isUploading, isCompleted]);

    return null;
};

export default UploadUnloadGuard;