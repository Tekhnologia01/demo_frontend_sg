import { useState } from "react";
import HeaderBackground from "../assets/dashboardHeader.svg";
import AddModal from "../modals/AddModal";
import CreateFolder from "../modals/CreateFolder";

const DashboardHeader = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const openAddModal = () => setIsAddModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const closeAddModal = () => setIsAddModalOpen(false);

  return (
    <>
      <div
        className="w-full h-80 bg-cover object-cover bg-center flex flex-col gap-3 sm:pt-14 pt-8 items-center px-5"
        style={{
          backgroundImage: `url(${HeaderBackground})`,
        }}
      >
        <h1 className="lg:text-4xl sm:text-3xl text-2xl text-center font-bold">
          Capture Every Moment, Share Instantly
        </h1>
        <p className="text-center lg:text-md sm:text-sm text-xs">
          Create a gallery, invite guests, and start collecting memories in
          seconds.
        </p>
        <div className="flex flex-wrap justify-center sm:gap-4 gap-2 py-4">
          <button className="w-fit cursor-pointer p-2 px-6 outline-0 rounded-full border text-[#6D31ED] border-[#3E1C87]" onClick={() => openModal()}>Create Folder</button>
          <button className="w-fit cursor-pointer p-2 px-6 outline-0 rounded-full text-white bg-gradient-to-r from-[#3E1C87] to-[#6D31ED]" onClick={()=>openAddModal()}>Join Folder</button>
        </div>
      </div>

      <CreateFolder
        isOpen={isModalOpen}
        onClose={closeModal}
      />

       <AddModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
      />
    </>
  );
};

export default DashboardHeader;
