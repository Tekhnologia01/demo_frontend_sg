import React from "react";
import { formatEpochToDate } from "../utils/epochUtils";
import { useNavigate } from "react-router-dom";
import { decrypt } from "../services/decrypt";

const FolderCard = ({ data, onClick, onRightClick }) => {
    const { folder_name, folder_color, content_count, latest_data, created_at } =
        data;
    const imageList = latest_data;
    const navigate = useNavigate();

    return (
        <div
            className="flex flex-col items-center w-36 p-1 pt-6 cursor-pointer"
            onClick={() => onClick(data)}
            onContextMenu={(e) => onRightClick(e, data)}
        >
            {/* Folder Container */}
            <div
                className="relative w-32 h-32 mb-2 rounded-xl transition duration-300"
                style={{
                    boxShadow: `0 0 6px 2px ${folder_color}44`,
                }}
            >
                {/* Background folder layers */}
                <div
                    className="absolute w-28 h-28 top-3 left-3 rounded-xl opacity-40"
                    style={{ backgroundColor: folder_color }}
                ></div>
                <div
                    className="absolute w-30 h-30 top-1.5 left-1.5 rounded-xl opacity-60"
                    style={{ backgroundColor: folder_color }}
                ></div>

                {/* Main folder */}
                <div
                    className="absolute w-32 h-32 top-0 left-0 rounded-b-xl rounded-l-xl"
                    style={{ backgroundColor: folder_color }}
                >

                    {/* Folder Tab */}
                    <div
                        className="absolute -top-4 right-0 h-4 shadow-md"
                        style={{
                            width: "75px",
                            backgroundColor: folder_color,
                            clipPath: "polygon(35% 0%, 100% 0%, 100% 100%, 0% 100%)",
                            borderTopLeftRadius: "0.5rem",
                            borderTopRightRadius: "0.5rem",
                        }}
                    ></div>

                    {/* Pocket area */}
                    <div className="absolute top-2 left-2 right-2 bottom-6 rounded-lg">
                        <div className="absolute inset-1 rounded-md bg-gradient-to-br from-black/10 to-transparent">
                            <div className="relative top-2 w-full h-full flex flex-col items-center">
                                {imageList && imageList.length !== 0 ? (
                                    imageList?.map((image, index) => {
                                        const offsetX =
                                            (index % 2 === 0 ? 1 : -1) * (Math.random() * 6);
                                        const rotation =
                                            (index % 2 === 0 ? 1 : -1) * (Math.random() * 6);
                                        const verticalPosition = index * 10;

                                        return (
                                            <div
                                                key={index}
                                                className="absolute w-14 h-16 rounded overflow-hidden shadow border border-white/40"
                                                style={{
                                                    bottom: `${verticalPosition + 6}px`,
                                                    transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
                                                    zIndex: imageList.length - index,
                                                    filter:
                                                        index > 0 ? "brightness(0.9)" : "brightness(1)",
                                                }}
                                            >
                                                <img
                                                    src={decrypt(image)}
                                                    alt={`${name} image ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-sm text-gray-500 flex items-center justify-center text-center mt-4">
                                        No media
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pocket opening edge */}
                    <div
                        className="absolute bottom-3 left-2 right-2 h-3 rounded-b-md z-30"
                        style={{ backgroundColor: folder_color }}
                    ></div>

                    {/* Folder Flap */}
                    <div
                        className="absolute bottom-0 left-0 w-full h-12 rounded-b-xl transform origin-bottom-left z-35"
                        style={{ backgroundColor: folder_color }}
                    >
                        {/* <div className="absolute top-1.5 right-3 w-6 h-6 text-xs font-semibold z-40 text-gray-800 flex items-center justify-center">
                            {content_count}
                        </div> */}
                       {
                        content_count > 0 && 
                         <div className="absolute bottom-2 right-2 bg-white/10 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded shadow-xs z-50">
                            {content_count}
                        </div>
                       }
                    </div>

                    {/* Front edge highlight */}
                    <div className="absolute inset-0 rounded-xl border border-white/20 pointer-events-none"></div>
                </div>
            </div>

            {/* Folder Info */}
            <div className="text-center">
                <h3 className="font-semibold text-gray-800 mb-0.5">
                    {decrypt(folder_name)}
                </h3>
                <p className="text-[11px] font-medium text-gray-500">
                    {formatEpochToDate(created_at)}
                </p>
            </div>
        </div>
    );
};

export default React.memo(FolderCard);