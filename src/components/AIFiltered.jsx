import React from "react";
import { FaArrowDownLong } from "react-icons/fa6";

const AIFiltered = () => {
  const photos = [
  {
    src: "https://images.unsplash.com/photo-1513689125086-6c432170e843?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aGVhcnR8ZW58MHx8MHx8fDA%3D",
    alt: "Favourite",
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1673292293042-cafd9c8a3ab3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlfGVufDB8fDB8fHww",
    alt: "Nature",
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1661475916373-5aaaeb4a5393?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFtaWx5fGVufDB8fDB8fHww",
    alt: "Family",
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8am91cm5leXxlbnwwfHwwfHx8MA%3D%3D",
    alt: "Journey",
  },
  {
    src: "https://images.unsplash.com/photo-1582711012124-a56cf82307a0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZlc3RpdmFsfGVufDB8fDB8fHww",
    alt: "Festival",
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1661890079209-72b76e49768f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y3JpY2tldHxlbnwwfHwwfHx8MA%3D%3D",
    alt: "Sports",
  },
  {
    src: "https://images.unsplash.com/photo-1621451683587-8be65b8b975c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGV4cHJlc3Npb258ZW58MHx8MHx8fDA%3D",
    alt: "Expression",
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1673292293042-cafd9c8a3ab3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlfGVufDB8fDB8fHww",
    alt: "Nature",
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1661475916373-5aaaeb4a5393?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFtaWx5fGVufDB8fDB8fHww",
    alt: "Family",
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1677002240252-af3f88114efc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8am91cm5leXxlbnwwfHwwfHx8MA%3D%3D",
    alt: "Journey",
  },
  {
    src: "https://images.unsplash.com/photo-1582711012124-a56cf82307a0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZlc3RpdmFsfGVufDB8fDB8fHww",
    alt: "Festival",
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1661890079209-72b76e49768f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y3JpY2tldHxlbnwwfHwwfHx8MA%3D%3D",
    alt: "Sports",
  },
  {
    src: "https://images.unsplash.com/photo-1577083753695-e010191bacb5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGl3YWxpfGVufDB8fDB8fHww",
    alt: "Diwali",
  },
  {
    src: "https://images.unsplash.com/photo-1513689125086-6c432170e843?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aGVhcnR8ZW58MHx8MHx8fDA%3D",
    alt: "Favourite",
  },
 {
    src: "https://plus.unsplash.com/premium_photo-1673292293042-cafd9c8a3ab3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlfGVufDB8fDB8fHww",
    alt: "Nature",
  },
];


  const ImageCard = React.memo(({ photo }) => (
    <div className="relative w-[200px] h-[100px] rounded-full overflow-hidden">
      <img
        src={`${photo.src}?w=400&auto=format&fit=crop`}
        alt={photo.alt}
        loading="lazy"
        width="200"
        height="100"
        className="w-full h-full object-cover will-change-transform"
      />
      <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold bg-black/30">
        {photo.alt.toUpperCase()}
      </span>
    </div>
  ));

  return (
    <div className="p-4 pt-0 w-full max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-[#565D6D]">AI Filtered</h2>
      </div>

      <div className="my-4 flex flex-wrap gap-5 justify-evenly">
        {photos?.map((photo, index) => (
          <ImageCard key={index} photo={photo} />
        ))}
      </div>

      <div className="flex justify-center">
        <div className="p-3 border border-[#6D31ED] rounded-full text-[#6D31ED] cursor-pointer">
          <FaArrowDownLong />
        </div>
      </div>
    </div>
  );
};

export default AIFiltered;
