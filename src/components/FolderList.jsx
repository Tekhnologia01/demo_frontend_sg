const FolderList = () => {
    return (
        <section className="px-4">
            {!!breadcrumbs.length && (
                <h2 className="text-lg text-gray-700 font-semibold mb-2">
                    Folders
                </h2>
            )}
            <div className="flex items-center flex-wrap justify-center gap-4">
                {isFoldersLoading || isFoldersFetching ? (
                    <Spinner size={36} />
                ) : isFoldersError ? (
                    <p className="text-red-500">Failed to load folders</p>
                ) : folders.length > 0 ? (
                    folders.map((folder) => (
                        <FolderCard
                            data={folder}
                            key={folder.folder_id}
                            onClick={handleFolderClick}
                            onRightClick={handleFolderRightClick}
                        />
                    ))
                ) : (
                    <p>No folders found</p>
                )}
            </div>

            {totalFolders > 0 && totalFolders > limitPerPage && (
                <Pagination
                    currentPage={folderPage}
                    limitPerPage={limitPerPage}
                    totalRecords={foldersData?.totalRecords}
                    onPageChange={setFolderPage}
                />
            )}
        </section>
    )
}

export default FolderList;