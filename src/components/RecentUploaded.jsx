import { VscSettings } from "react-icons/vsc";
import MasonryLayout from "./Common/MasonryLayout";

const recentImages = [
  {
    media_thumb_url:
      "https://images.unsplash.com/photo-1750128839549-d918cc10dc6a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNXx8fGVufDB8fHx8fA%3D%3D",
    alt: "Portrait #1",
  },
  {
    media_thumb_url:
      "https://images.unsplash.com/photo-1744294724362-3f5c404c771a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Portrait #2",
  },
  {
    media_thumb_url:
      "https://images.unsplash.com/photo-1750087023850-36213c737960?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzNHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Portrait #3",
  },
  {
    media_thumb_url:
      "https://images.unsplash.com/photo-1494256997604-768d1f608cac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGV0fGVufDB8fDB8fHww",
    alt: "Pet #1",
  },
  {
    media_thumb_url:
      "https://images.unsplash.com/photo-1745933115134-9cd90e3efcc7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE3fGJvOGpRS1RhRTBZfHxlbnwwfHx8fHw%3D",
    alt: "Nature #1",
  },
  {
    media_thumb_url:
      "https://images.unsplash.com/photo-1547014762-3a94fb4df70a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE4fDZzTVZqVExTa2VRfHxlbnwwfHx8fHw%3D",
    alt: "Nature #2",
  },
  {
    media_thumb_url:
      "https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDl8TThqVmJMYlRSd3N8fGVufDB8fHx8fA%3D%3D",
    alt: "Nature #3",
  },
  {
    media_thumb_url:
      "https://plus.unsplash.com/premium_photo-1719943510748-4b4354fbcf56?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bmF0dXJlfGVufDB8fDB8fHww",
    alt: "Nature #4",
  },
  {
    media_thumb_url:
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bmF0dXJlfGVufDB8fDB8fHww",
    alt: "Nature #5",
  },
  {
    media_thumb_url:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fHww",
    alt: "Cat #1",
  },
  {
    media_thumb_url:
      "https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D",
    alt: "Nature #6",
  },
  {
    media_thumb_url:
      "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNhdHxlbnwwfHwwfHx8MA%3D%3D",
    alt: "Cat #2",
  },
  {
    media_thumb_url:
      "https://plus.unsplash.com/premium_photo-1724413941655-24c6eb2b28c3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE3fDZzTVZqVExTa2VRfHxlbnwwfHx8fHw%3D",
    alt: "Nature #7",
  },
  {
    media_thumb_url:
      "https://plus.unsplash.com/premium_photo-1677181729163-33e6b59d5c8f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2F0fGVufDB8fDB8fHww",
    alt: "Cat #3",
  },
];

// const initialPhotos = recentImages.map((url, idx) => ({
//   src: url,
//   alt: `Portrait #${idx + 1}`
// }));


// const initialPhotos = Array.from({ length: 11 }, (_, i) => ({
//   src: `https://sgfile.blob.core.windows.net/sgfile/userPhoto/thumb-1748262084518.webp?key=${26 + i}`,
//   alt: "Mountain View",
// }));

const RecentlyUploaded = () => {

  return (
    <div className="p-4 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#565D6D]">Recently Uploaded Images</h2>
        <VscSettings className="text-2xl text-[#6D31ED]" />
      </div>

      <div className="mt-4">
         <MasonryLayout
          initialMedia={recentImages}
          urlKey="media_thumb_url"
        />
      </div>
    </div>
  );
};

export default RecentlyUploaded;