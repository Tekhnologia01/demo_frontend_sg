// // import Masonry from "react-masonry-css";
// // import PropTypes from "prop-types";
// // import { useState } from "react";

// // const MasonryLayout = ({ initialPhotos }) => {
// //   const breakpointColumnsObj = {
// //     default: 4,
// //     1280: 3,
// //     768: 2,
// //     500: 1,
// //   };

// //   return (
// //     <Masonry
// //       breakpointCols={breakpointColumnsObj}
// //       className="flex -ml-4 w-auto"
// //       columnClassName="pl-4"
// //     >
// //       {initialPhotos.map((photo, index) => (
// //         <ImageWithSkeleton key={index} src={photo.src} alt={photo.alt} />
// //       ))}
// //     </Masonry>
// //   );
// // };

// // const ImageWithSkeleton = ({ src, alt }) => {
// //   const [loaded, setLoaded] = useState(false);

// //   return (
// //     <div className="mb-4 relative w-full">
// //       {!loaded && (
// //         <div className="w-full aspect-[4/3] bg-gray-300 animate-pulse rounded-lg" />
// //       )}
// //       <img
// //         src={`${src}`}
// //         alt={alt}
// //         loading="lazy"
// //         onLoad={() => setLoaded(true)}
// //         className={`w-full rounded-lg object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0 absolute top-0 left-0"
// //           }`}
// //       />
// //     </div>
// //   );
// // };

// // MasonryLayout.propTypes = {
// //   initialPhotos: PropTypes.arrayOf(
// //     PropTypes.shape({
// //       src: PropTypes.string.isRequired,
// //       alt: PropTypes.string.isRequired,
// //     })
// //   ).isRequired,
// // };

// // ImageWithSkeleton.propTypes = {
// //   src: PropTypes.string.isRequired,
// //   alt: PropTypes.string.isRequired,
// // };

// // export default MasonryLayout;


// // import Masonry from "react-masonry-css";
// // import PropTypes from "prop-types";
// // import { useState, useEffect } from "react";
// // import { FaSquareCheck } from "react-icons/fa6";
// // import { MdCheckBoxOutlineBlank } from "react-icons/md";

// // const MasonryLayout = ({ initialPhotos, selectable = false, onSelectionChange = false }) => {
// //   const breakpointColumnsObj = {
// //     default: 4,
// //     1280: 3,
// //     768: 2,
// //     500: 1,
// //   };

// //   const [selectedPhotos, setSelectedPhotos] = useState([]);

// //   const toggleSelect = (index) => {
// //     setSelectedPhotos((prev) =>
// //       prev.includes(index)
// //         ? prev.filter((i) => i !== index)
// //         : [...prev, index]
// //     );
// //   };

// //   // Notify parent of selected images

// //   // useEffect(() => {
// //   //   if (selectable && typeof onSelectionChange === "function") {
// //   //     const selected = selectedPhotos.map((i) => initialPhotos[i]);
// //   //     onSelectionChange(selected);
// //   //   }
// //   // }, [selectedPhotos, initialPhotos, onSelectionChange, selectable]);

// //    useEffect(() => {
// //     if (onSelectionChange) {
// //       onSelectionChange(selectedPhotos);
// //     }
// //   }, [selectedPhotos, onSelectionChange]);

// //   return (
// //     <Masonry
// //       breakpointCols={breakpointColumnsObj}
// //       className="flex -ml-4 w-auto"
// //       columnClassName="pl-4"
// //     >
// //       {initialPhotos.map((photo, index) => (
// //         <ImageWithSkeleton
// //           key={index}
// //           src={photo.src}
// //           alt={photo.alt}
// //           selectable={selectable}
// //           selected={selectedPhotos.includes(index)}
// //           onToggle={() => toggleSelect(index)}
// //         />
// //       ))}
// //     </Masonry>
// //   );
// // };

// // const ImageWithSkeleton = ({ src, alt, selectable, selected, onToggle }) => {
// //   const [loaded, setLoaded] = useState(false);

// //   return (
// //     <div className="mb-4 relative w-full group">
// //       {!loaded && (
// //         <div className="w-full aspect-[4/3] bg-gray-300 animate-pulse rounded-lg" />
// //       )}

// //       <img
// //         src={src}
// //         alt={alt}
// //         loading="lazy"
// //         onClick={selectable ? onToggle : undefined}
// //         onLoad={() => setLoaded(true)}
// //         className={`w-full rounded-lg object-cover transition-opacity duration-300 ${
// //           loaded ? "opacity-100" : "opacity-0 absolute top-0 left-0"
// //         }`}
// //       />

// //       {selectable && loaded && (
// //         <button
// //           onClick={onToggle}
// //           className="absolute bottom-2 right-2 z-10 text-white rounded-full p-1"
// //         >
// //           {selected ? 
// //             <FaSquareCheck className="text-white text-xl" /> :
// //             <MdCheckBoxOutlineBlank className="text-white text-xl" /> 
// //           }
// //         </button>
// //       )}
// //     </div>
// //   );
// // };

// // MasonryLayout.propTypes = {
// //   initialPhotos: PropTypes.arrayOf(
// //     PropTypes.shape({
// //       src: PropTypes.string.isRequired,
// //       alt: PropTypes.string.isRequired,
// //     })
// //   ).isRequired,
// //   selectable: PropTypes.bool,
// //   onSelectionChange: PropTypes.func,
// // };

// // ImageWithSkeleton.propTypes = {
// //   src: PropTypes.string.isRequired,
// //   alt: PropTypes.string.isRequired,
// //   selectable: PropTypes.bool,
// //   selected: PropTypes.bool,
// //   onToggle: PropTypes.func,
// // };

// // export default MasonryLayout;

// import Masonry from "react-masonry-css";
// import PropTypes from "prop-types";
// import { useState, useEffect } from "react";
// import { FaSquareCheck } from "react-icons/fa6";
// import { MdCheckBoxOutlineBlank } from "react-icons/md";

// const MasonryLayout = ({ initialPhotos, selectable = false, onSelectionChange = false }) => {
//   const breakpointColumnsObj = {
//     default: 4,
//     1280: 3,
//     768: 2,
//     500: 1,
//   };

//   const [selectedPhotos, setSelectedPhotos] = useState([]);
//   const [isAllSelected, setIsAllSelected] = useState(false);

//   const toggleSelect = (photo,index) => {
//     console.log(photo);
    
//     setSelectedPhotos((prev) => {
//       const newSelection = prev.includes(index)
//         ? prev.filter((i) => i !== index)
//         : [...prev, index];
//       setIsAllSelected(newSelection.length === initialPhotos.length);
//       return newSelection;
//     });
//   };

//   const handleSelectAllToggle = () => {
//     if (isAllSelected) {
//       setSelectedPhotos([]);
//       setIsAllSelected(false);
//     } else {
//       const allIndices = initialPhotos.map((_, index) => index);
//       setSelectedPhotos(allIndices);
//       setIsAllSelected(true);
//     }
//   };

//   useEffect(() => {
//     if (onSelectionChange) {
//       onSelectionChange(selectedPhotos);
//     }
//   }, [selectedPhotos, onSelectionChange]);

//   console.log(selectedPhotos);
  
//   return (
//     <div className="w-full">
//       {selectable && (
//         <div className="flex items-center justify-end mb-4 pr-4">
//           <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={isAllSelected}
//               onChange={handleSelectAllToggle}
//               className="w-4 h-4"
//             />
//             Select All
//           </label>
//         </div>
//       )}

//       <Masonry
//         breakpointCols={breakpointColumnsObj}
//         className="flex -ml-4 w-auto"
//         columnClassName="pl-4"
//       >
//         {initialPhotos.map((photo, index) => (
//           <ImageWithSkeleton
//             key={index}
//             src={photo}
//             alt={photo}
//             selectable={selectable}
//             selected={selectedPhotos.includes(index)}
//             onToggle={() => toggleSelect(photo,index)}
//           />
//         ))}
//       </Masonry>
//     </div>
//   );
// };

// const ImageWithSkeleton = ({ src, alt, selectable, selected, onToggle }) => {
//   const [loaded, setLoaded] = useState(false);

//   return (
//     <div className="mb-4 relative w-full group">
//       {!loaded && (
//         <div className="w-full h-auto aspect-[4/3] bg-gray-300 animate-pulse rounded-lg" />
//       )}

//       <img
//         src={src}
//         alt={alt}
//         loading="lazy"
//         onClick={selectable ? onToggle : undefined}
//         onLoad={() => setLoaded(true)}
//         className={`w-full rounded-lg object-cover transition-opacity duration-300 ${
//           loaded ? "opacity-100" : "opacity-0 absolute top-0 left-0"
//         }`}
//       />

//       {selectable && loaded && (
//         <button
//           onClick={onToggle}
//           className="absolute bottom-2 right-2 z-10 text-white rounded-full p-1"
//         >
//           {selected ? (
//             <FaSquareCheck className="text-white text-xl" />
//           ) : (
//             <MdCheckBoxOutlineBlank className="text-white text-xl" />
//           )}
//         </button>
//       )}
//     </div>
//   );
// };

// MasonryLayout.propTypes = {
//   initialPhotos: PropTypes.arrayOf(
//     PropTypes.shape({
//       src: PropTypes.string.isRequired,
//       alt: PropTypes.string.isRequired,
//     })
//   ).isRequired,
//   selectable: PropTypes.bool,
//   onSelectionChange: PropTypes.func,
// };

// ImageWithSkeleton.propTypes = {
//   src: PropTypes.string.isRequired,
//   alt: PropTypes.string.isRequired,
//   selectable: PropTypes.bool,
//   selected: PropTypes.bool,
//   onToggle: PropTypes.func,
// };

// export default MasonryLayout;

import Masonry from "react-masonry-css";
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { FaSquareCheck } from "react-icons/fa6";
import { MdCheckBoxOutlineBlank } from "react-icons/md";

const MasonryLayout = ({ initialPhotos, selectable = false, onSelectionChange = false }) => {
  const breakpointColumnsObj = {
    default: 4,
    1280: 3,
    768: 2,
    500: 1,
  };

  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const toggleSelect = (photo, index) => {
    setSelectedPhotos((prev) => {
      const newSelection = prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index];
      setIsAllSelected(newSelection.length === initialPhotos.length);
      return newSelection;
    });
  };

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      setSelectedPhotos([]);
      setIsAllSelected(false);
    } else {
      const allIndices = initialPhotos.map((_, index) => index);
      setSelectedPhotos(allIndices);
      setIsAllSelected(true);
    }
  };

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedPhotos);
    }
  }, [selectedPhotos, onSelectionChange]);

  return (
    <div className="w-full">
      {selectable && (
        <div className="flex items-center justify-end mb-4 pr-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAllToggle}
              className="w-4 h-4"
            />
            Select All
          </label>
        </div>
      )}

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4"
      >
        {initialPhotos.map((photo, index) => (
          <ImageWithSkeleton
            key={index}
            src={photo}
            alt={`Image ${index}`}
            selectable={selectable}
            selected={selectedPhotos.includes(index)}
            onToggle={() => toggleSelect(photo, index)}
          />
        ))}
      </Masonry>
    </div>
  );
};

const ImageWithSkeleton = ({ src, alt, selectable, selected, onToggle }) => {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

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

  return (
    <div
      ref={ref}
      className={`mb-4 relative w-full transform transition-all duration-700 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      {!loaded && (
        <div className="w-full aspect-[4/3] bg-gray-300 animate-pulse rounded-lg" />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        onClick={selectable ? onToggle : undefined}
        onLoad={() => setLoaded(true)}
        className={`w-full rounded-lg object-cover transition-opacity duration-300 hover:opacity-80 hover:cursor-pointer ${
          loaded ? "opacity-100" : "opacity-0 absolute top-0 left-0"
        }`}
      />

      {selectable && loaded && (
        <button
          onClick={onToggle}
          className="absolute bottom-2 right-2 z-10 text-white rounded-full p-1 backdrop-blur"
        >
          {selected ? (
            <FaSquareCheck className="text-white text-xl" />
          ) : (
            <MdCheckBoxOutlineBlank className="text-white text-xl" />
          )}
        </button>
      )}
    </div>
  );
};

MasonryLayout.propTypes = {
  initialPhotos: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectable: PropTypes.bool,
  onSelectionChange: PropTypes.func,
};

ImageWithSkeleton.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default MasonryLayout;
