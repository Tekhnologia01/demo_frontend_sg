import { useState } from "react";
import Searchbar from "./Common/Searchbar";
import { FiPlusCircle } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import Profile from "../assets/profile.jpg";

const ViewGroup = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-12">
      <h4 className="text-center text-2xl font-bold text-[#565D6D]">Search</h4>
      <div className="w-1/2 mx-auto my-2">
        <Searchbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          title={""}
          placeholder={"Search by circle name"}
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-[#565D6D]">
          All Created Circle
        </h2>
      </div>

      <div className="my-2 flex gap-4 flex-wrap">
        <div className="p-2 rounded-xl border border-[#B2B2B2] w-36 h-44 flex flex-col justify-between relative shadow-sm">
          <div className="absolute top-2 right-2">
            <BsThreeDotsVertical />
          </div>

          <div className="flex flex-col items-center justify-center h-full gap-2">
            <FiPlusCircle className="text-[#828282] text-6xl" />
            <span className="text-xs text-[#828282] font-semibold">
              Create Circle
            </span>
          </div>
        </div>

        <div className="p-2 rounded-xl border border-[#B2B2B2] w-36 h-44 flex flex-col justify-between relative shadow-sm">
          <div className="absolute top-2 right-2 text-gray-500">
            <BsThreeDotsVertical />
          </div>

          <div className="flex flex-col items-center justify-center h-full gap-2">
            <img
              src={Profile}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />

            <span className="text-md text-black font-bold">My Family</span>

            <div className="flex items-center space-x-[-8px] mt-1">
              <img
                src={""}
                alt="avatar"
                className="w-6 h-6 rounded-full border-2 border-white"
              />
              <img
                src={""}
                alt="avatar"
                className="w-6 h-6 rounded-full border-2 border-white"
              />
              <img
                src={""}
                alt="avatar"
                className="w-6 h-6 rounded-full border-2 border-white"
              />
              <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm border-2 border-white">
                +
              </div>
            </div>

            <span className="text-xs text-[#828282] mt-1">50 Participants</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewGroup;
