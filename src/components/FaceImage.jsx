import React, { memo, useState } from "react";
import { FaPlus } from "react-icons/fa6";

const faceImages = [
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHVzZXJ8ZW58MHx8MHx8fDA%3D',
  'https://plus.unsplash.com/premium_photo-1664536392896-cd1743f9c02c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZmFjZXxlbnwwfHwwfHx8MA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1670884442192-7b58d513cd55?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZhY2V8ZW58MHx8MHx8fDA%3D',
  'https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWFufGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1508341591423-4347099e1f19?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1lbnxlbnwwfHwwfHx8MA%3D%3D'
]

const photos = faceImages.map((i,index) => ({
  id: index + 1,
  name: index === 0 ? "You" : 'user' + (index + 1),
  src: i,
  alt: "Face Photo",
}));

const FaceImageItem = memo(({ src, alt, name }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center w-20 sm:w-24 text-center">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
        {/* Skeleton Circle */}
        {!loaded && (
          <div className="absolute inset-0 rounded-full bg-gray-300 animate-pulse" />
        )}

        {/* Actual Image */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`rounded-full object-cover w-16 h-16 sm:w-20 sm:h-20 transition-opacity duration-300 absolute inset-0 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>
      <p className="text-xs sm:text-sm mt-1 truncate w-full">{name}</p>
    </div>
  );
});

const FaceImage = () => {
  return (
    <div
      className="flex items-center gap-2 sm:gap-4 p-5 mt-2 max-w-7xl mx-auto overflow-hidden bg-white"
      style={{ marginTop: '-88px' }}
    >
      {/* Add Button
      <div className="flex justify-center items-center text-[#7F55E0] border-2 border-dashed border-[#7F55E0] rounded-full cursor-pointer flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20">
        <FaPlus size={22} className="sm:size-6 md:size-7" />
      </div> */}

      {/* Scrollable list */}
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pl-1 pr-2 min-w-0">
        {photos.map((photo) => (
          <FaceImageItem key={photo.id} src={photo.src} alt={photo.alt} name={photo.name} />
        ))}
      </div>
    </div>
  );
};

export default memo(FaceImage);