import Masonry from "react-masonry-css";
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { FaSquareCheck } from "react-icons/fa6";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import toast from "react-hot-toast";
import axiosClient from "../../services/axiosInstance";
import ConfirmationModal from "../../modals/ConfirmationModal";

const MasonryLayout = ({
  initialMedia,
  urlKey = "media_thumb_url",
  selectable = false,
  selectedMedia,
  mediaRefetch,
  onSelectionChange,
}) => {
  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    768: 2,
    500: 1,
  };

  return (
    <div className="w-full">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4"
      >
        {initialMedia?.map((media, idx) => (
          <ImageWithSkeleton
            key={media.id || idx}
            media={media}
            urlKey={urlKey}
            selectable={selectable}
            selected={selectedMedia?.some((id) => id === media.id)}
            onSelectToggle={() => {
              onSelectionChange(media.id)
            }}
            mediaRefetch={mediaRefetch}
          />
        ))}
      </Masonry>
    </div>
  );
};

const ImageWithSkeleton = ({
  media,
  urlKey,
  selectable,
  selected,
  onSelectToggle,
  mediaRefetch
}) => {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Scroll-in animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoveClick = () => {
    console.log("Love clicked for media:", media);
    // Add logic for "Love" action (e.g., API call to mark as favorite)
  };

  const handleDeleteClick = async () => {
    try {
      const payload = {
        mediaIds: [media?.id],
        status: "DELETED",
      };
      await toast.promise(axiosClient.patch(`/media/status`, payload), {
        loading: "Deleting media...",
        success: () => {
          mediaRefetch();
          return "Media deleted successfully";
        },
        error: () => {
          return "Failed to delete media";
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        ref={ref}
        className={`mb-4 relative w-full transform transition-all duration-700 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!loaded && (
          <div className="w-full aspect-[4/3] bg-gray-300 animate-pulse rounded-lg" />
        )}

        <img
          src={media[urlKey]}
          alt={media.alt || `Image ${media.id}`}
          loading="lazy"
          onClick={() => {
            selectable ? onSelectToggle : null
          }}
          onLoad={() => setLoaded(true)}
          className={`w-full rounded-lg object-cover transition-opacity duration-300 hover:cursor-pointer
          ${loaded ? "opacity-100" : "opacity-0 absolute top-0 left-0"}`}
        />

        {loaded && (
          <div
            className={`absolute bottom-2 right-2 z-10 flex gap-2 transition-all duration-300 ease-in-out
            ${isHovered || selected
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
              }`}
          >
            {!selectable && (
              <>
                <button
                  onClick={handleLoveClick}
                  className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:text-red-600
              hover:scale-110 transform transition-all duration-200 hover:cursor-pointer"
                  title="Love"
                >
                  <FaHeart className="text-xl" />
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:text-red-600
              hover:scale-110 transform transition-all duration-200 hover:cursor-pointer"
                  title="Delete"
                >
                  <RiDeleteBin6Line className="text-xl" />
                </button>
              </>
            )}
            {selectable && (
              <button
                onClick={onSelectToggle}
                className="p-2.5 rounded-full backdrop-blur-sm text-black hover:cursor-pointer"
              >
                {selected ? (
                  <FaSquareCheck className="text-purple-600 text-2xl" />
                ) : (
                  <MdCheckBoxOutlineBlank className="text-white text-2xl" />
                )}
              </button>
            )}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        callbackFn={handleDeleteClick}
        message={"Are you sure to delete this media?"}
        icon={<RiDeleteBin6Line size={46} color="gray" />}
      />
    </>
  );
};

MasonryLayout.propTypes = {
  initialMedia: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      media_thumb_url: PropTypes.string,
      alt: PropTypes.string,
    })
  ).isRequired,
  urlKey: PropTypes.string,
  selectable: PropTypes.bool,
  onSelectionChange: PropTypes.func,
};

ImageWithSkeleton.propTypes = {
  media: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    media_thumb_url: PropTypes.string,
    alt: PropTypes.string,
  }).isRequired,
  urlKey: PropTypes.string,
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  onSelectToggle: PropTypes.func,
};

export default MasonryLayout;
