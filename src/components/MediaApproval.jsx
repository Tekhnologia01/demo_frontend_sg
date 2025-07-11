import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { FaArrowDownLong } from "react-icons/fa6";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import MasonryLayout from "./Common/MasonryLayout";
import { useState, useCallback, useMemo } from "react";
import axiosClient from "../services/axiosInstance";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { decrypt } from "../services/decrypt";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import ConfirmationModal from "../modals/ConfirmationModal";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdArrowRoundBack } from "react-icons/io";

const MediaApproval = ({ onBack }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState([]);
  const [mediaId, setMediaId] = useState(0);
  const [mediaStatus, setMediaStatus] = useState("PENDING");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 5;

  const { currentFolderId } = useSelector((state) => state?.folder);

  const fetchMediaRequests = async () => {
    try {
      const response = await axiosClient.get(
        `/media/request?limit=${limit}&page=${page}&folderId=${currentFolderId}`
      );
      return response?.data?.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { data: mediaData, refetch } = useQuery({
    queryKey: ["mediaRequests", page, currentFolderId],
    queryFn: fetchMediaRequests,
    enabled: currentFolderId !== null,
    staleTime: Infinity,
    gcTime: 360000,
    placeholderData: keepPreviousData,
  });

  // Memoize initialMedia to prevent unnecessary re-renders
  const initialMedia = useMemo(() => {
    return mediaData?.map((item) => ({
      id: item.media_id,
      media_thumb_url: decrypt(item.media_thumb_url),
      alt: item?.alt || "Media image",
      title: item?.title,
    })) || [];
  }, [mediaData]);

  const updateMediaStatus = async (mediaIds, status) => {
    try {
      const payload = {
        mediaIds,
        status,
      };
      await toast.promise(axiosClient.patch(`/media/status`, payload), {
        loading: "Updating media status...",
        success: (res) => {
          refetch();
          setSelected([]); // Clear selection after action
          return res?.data?.message || "Media status updated successfully";
        },
        error: (err) => {
          return err?.response?.data?.message || "Failed to update media status";
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleBulkAction = async (status) => {
    if (selected.length === 0) return;
    const mediaIds = selected.map((item) => item.id);
    setMediaStatus(status);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmAction = useCallback(() => {
    const mediaIds = mediaStatus === "PENDING" ? [mediaId] : selected.map((item) => item.id);
    updateMediaStatus(mediaIds, mediaStatus);
    setIsDeleteModalOpen(false);
  }, [mediaId, mediaStatus, selected]);

  const handleSelectionChange = useCallback((selectedMedia) => {
    setSelected(selectedMedia);
  }, []);

  return (
    <>
      <div className="p-8 w-full max-w-7xl mx-auto" style={{ userSelect: "none" }}>
        <div className="ms-4">
          <div className="flex items-center gap-4">
            <div className="w-fit p-2 rounded-full bg-gray-200 hover:cursor-pointer">
              <IoMdArrowRoundBack className="text-2xl" onClick={onBack} />
            </div>
            <span className="font-semibold text-[#6D31ED]">
              {mediaData?.length} Images Uploaded
            </span>
          </div>

          <div className="w-full max-w-6xl mx-auto text-center py-8">
            <h2 className="text-2xl font-bold mb-6">Uploaded Images</h2>
            {mediaData?.length > 0 && !isVisible ? (
              <>
                <Swiper
                  modules={[Navigation, EffectCoverflow]}
                  effect="coverflow"
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView="auto"
                  initialSlide={Math.floor(mediaData?.length / 2)}
                  spaceBetween={40}
                  navigation
                  coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 2.5,
                    slideShadows: false,
                  }}
                  className="w-full max-w-6xl mx-auto"
                >
                  {mediaData?.map((data) => (
                    <SwiperSlide
                      key={data?.media_id}
                      className="!w-56 sm:!w-56 md:!w-64 lg:!w-80"
                    >
                      <div className="group relative rounded-xl overflow-hidden bg-white shadow-lg transition-transform duration-300">
                        <img
                          src={decrypt(data?.media_thumb_url)}
                          alt={data?.alt || "Media image"}
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute top-2 left-2 text-white font-bold text-sm drop-shadow-md z-10">
                          {/* {data?.title} */}
                        </div>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
                          <button
                            className="px-3 py-1 rounded-full cursor-pointer border-2 border-[#6D31ED] text-white text-xs"
                            onClick={() => {
                              setMediaId(data?.media_id);
                              setMediaStatus("REJECTED");
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            Reject
                          </button>
                          <button
                            className="px-3 py-1 rounded-full cursor-pointer bg-gradient-to-r from-[#6D31ED] to-[#3E1C87] text-white text-xs"
                            onClick={() => {
                              setMediaId(data?.media_id);
                              setMediaStatus("APPROVED");
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            Accept
                          </button>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-0" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="w-full max-w-6xl mx-auto text-center mt-8">
                  <div
                    className="h-12 w-12 p-2 cursor-pointer flex justify-center items-center rounded-full border-2 text-2xl border-[#6D31ED] text-[#6D31ED] mx-auto"
                    onClick={() => setIsVisible(true)}
                  >
                    <FaArrowDownLong />
                  </div>
                </div>
              </>
            ) : mediaData?.length > 0 ? (
              <>
                <MasonryLayout
                  initialMedia={initialMedia}
                  urlKey="media_thumb_url"
                  selectable
                  onSelectionChange={handleSelectionChange}
                />
                {selected?.length > 0 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      className="px-3 py-1 h-8 rounded-full cursor-pointer border-2 border-[#6D31ED] text-[#6D31ED]"
                      onClick={() => handleBulkAction("REJECTED")}
                    >
                      Reject
                    </button>
                    <button
                      className="px-3 py-1 rounded-full cursor-pointer bg-gradient-to-r from-[#6D31ED] to-[#3E1C87] text-white"
                      onClick={() => handleBulkAction("APPROVED")}
                    >
                      Accept
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-gray-600">No media request</p>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        callbackFn={handleConfirmAction}
        message={`Are you sure you want to ${mediaStatus.toLowerCase().slice(0, -2)} the selected media?`}
        icon={<RiDeleteBin6Line size={46} color="gray" />}
      />
    </>
  );
};

export default MediaApproval;