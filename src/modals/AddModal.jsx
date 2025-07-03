// import { Field, Formik } from 'formik';
// import React, { useState } from 'react';
// import { RxCross1 } from 'react-icons/rx';
// import { FaFolder, FaUser, FaUsers } from 'react-icons/fa';

// const AddModal = ({ isOpen, onClose }) => {
//   if (!isOpen) return null;

//   const [searchTerm, setSearchTerm] = useState('');

//   const handleBackdropClick = (e) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   const getIconByRole = (role) => {
//     switch (role) {
//       case 'folder':
//         return <FaFolder />;
//       case 'circle':
//         return <FaUsers />;
//       default:
//         return <FaUser />;
//     }
//   };

//   const usersList = Array(5).fill({ name: 'Shivam Dubey' });

//   return (
//     <div
//       className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur-xs p-4"
//       onClick={handleBackdropClick}
//       role="dialog"
//       aria-modal="true"
//     >
//       <Formik initialValues={{ addType: 'user' }}>
//         {({ values }) => {
//           const role = values.addType;
//           const placeholderText = {
//             user: 'Enter by email or phone',
//             folder: 'Enter by folder name',
//             circle: 'Enter by circle name',
//           }[role] || '';

//           return (
//             <div
//               className="bg-white w-full max-w-[550px] rounded-lg shadow-lg"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="w-full p-4 bg-[#F5F1FE] flex justify-between items-center rounded">
//                 <h2 className="text-[#6D31ED] text-2xl font-bold capitalize">
//                   Add {role}
//                 </h2>
//                 <button
//                   onClick={onClose}
//                   className="text-gray-600 hover:text-black text-xl cursor-pointer"
//                   aria-label="Close"
//                 >
//                   <RxCross1 />
//                 </button>
//               </div>

//               <div className="p-4">
//                 <Field
//                   as="select"
//                   name="addType"
//                   value={values.addType}
//                   className="border-0 rounded p-2 w-30 outline-0 capitalize"
//                 >
//                   <option value="user">User</option>
//                   <option value="folder">Folder</option>
//                   <option value="circle">Circle</option>
//                 </Field>

//                 <div className="my-4">
//                   <div className="border border-[#6D31ED] shadow-sm rounded-full w-full flex items-center gap-2 p-2 px-4">
//                     <input
//                       type="text"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       placeholder={placeholderText}
//                       className="border-0 outline-0 w-full"
//                     />
//                   </div>
//                 </div>

//                 {role && (
//                   <div className="border border-[#DEE1E6] rounded-lg p-1 sm:justify-start justify-center flex flex-wrap gap-1">
//                     {usersList.map((user, index) => (
//                       <div
//                         key={index}
//                         className="p-2 bg-[#F8F8F8] rounded-full w-fit flex items-center gap-2"
//                       >
//                         {getIconByRole(role)}
//                         <span>{user.name}</span>
//                         <RxCross1 className="text-[#6D31ED] cursor-pointer" />
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="flex justify-end gap-2 p-4">
//                 <button className="p-2 sm:w-1/4 w-1/3 rounded-full cursor-pointer text-white bg-gradient-to-r from-[#6D31ED] to-[#3E1C87] hover:opacity-90">
//                   Add
//                 </button>
//               </div>
//             </div>
//           );
//         }}
//       </Formik>
//     </div>
//   );
// };

// export default AddModal;












import { RxCross1 } from "react-icons/rx";
import { Field, Formik } from "formik";
import { useState } from "react";
import Profile from "../assets/profile.jpg";
import CustomDropdown from "../components/common/CustomDropdown";

const dummyUsers = [
  { id: 1, name: "Mahesh Kokate", mobileNo: "+91 8300893873", avatar: Profile },
  { id: 2, name: "Tejas Pawar", mobileNo: "+91 8300893873", avatar: Profile },
  { id: 3, name: "Rushi Patil", mobileNo: "+91 8300893873", avatar: Profile },
  { id: 4, name: "Mahesh Kokate", mobileNo: "+91 8300893873", avatar: Profile },
  { id: 5, name: "Tejas Pawar", mobileNo: "+91 8300893873", avatar: Profile },
  { id: 6, name: "Rushi Patil", mobileNo: "+91 8300893873", avatar: Profile },
];

const dummyFolders = [
  { id: 1, name: "Folder1", totalUsers: 200 },
  { id: 2, name: "Folder2", totalUsers: 50 },
  { id: 3, name: "Folder2", totalUsers: 100 },
]

const dummyCircles = [
  { id: 1, name: "Circle1", totalUsers: 243, image: Profile },
  { id: 2, name: "Circle1", totalUsers: 24, image: Profile },
  { id: 3, name: "Circle1", totalUsers: 213, image: Profile },
]

const folderColors = [
  "#FFD156", "#F23B31", "#F6722A", "#00A254", "#00948E", "#2880CB", "#A759C2", "#DA49B0", "#D9D9D9", "#FFBCB4", "#FFC08B", "#7AD596", "#68D2CD", "#83C6F3", "#DEABF2", "#FFA6E4"
]

const AddModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [title, setTitle] = useState('user');

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <Formik
        initialValues={{
          addType: "user",
          selectedUserIds: [],
          selectedCircleIds: [],
          selectedFolderIds: []
        }}
        onSubmit={(values) => {
          console.log("Form submitted:", values);
        }}
      >
        {({ handleSubmit, setFieldValue, values }) => (
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-[550px] rounded-xl shadow-lg flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full p-4 bg-[#F5F1FE] flex justify-between items-center rounded-t-xl">
              <h2 className="text-[#6D31ED] text-2xl font-bold px-2">Add {title}</h2>
              <button
                onClick={onClose}
                className="text-gray-600 p-1 hover:text-black text-xl cursor-pointer"
                aria-label="Close"
              >
                <RxCross1 />
              </button>
            </div>

            <div className="px-4 mb-2 mt-2 w-full flex flex-col justify-around gap-2">
              <Field
                as="select"
                name="addType"
                className="p-1 rounded border-0 outline-0 w-35"
                onChange={(e) => {
                  setFieldValue("addType", e.target.value);
                  setTitle(e.target.value);
                }}
              >
                <option value="user">Select user</option>
                <option value="circle">Select circle</option>
                <option value="folder">Select folder</option>
              </Field>
            </div>

            <div className="flex px-5 overflow-visible relative">
              {(() => {
                const { addType } = values;

                const configMap = {
                  user: {
                    data: dummyUsers,
                    value: values.selectedUserIds,
                    setValue: (value) => setFieldValue("selectedUserIds", value),
                    placeholder: "Select user",
                    searchPlaceholder: "Enter mobile number to search",
                    searchKey: "mobileNo",
                    renderItem: (user) => (
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} className="w-8 h-8 rounded-full" />
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.mobileNo}</div>
                        </div>
                      </div>
                    ),
                  },
                  folder: {
                    data: dummyFolders,
                    value: values.selectedFolderIds,
                    setValue: (value) => setFieldValue("selectedFolderIds", value),
                    placeholder: "Select folder",
                    searchPlaceholder: "Enter folder name to search",
                    searchKey: "name",
                    renderItem: (folder) => (
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium">{folder.name}</div>
                          <div className="text-sm text-gray-500">{folder.totalUsers}</div>
                        </div>
                      </div>
                    )
                  },
                  circle: {
                    data: dummyCircles,
                    value: values.selectedCircleIds,
                    setValue: (value) => setFieldValue("selectedCircleIds", value),
                    placeholder: "Select circle",
                    searchPlaceholder: "Enter circle name to search",
                    searchKey: "name",
                    renderItem: (circle) => (
                      <div className="flex items-center gap-3">
                        <img src={circle.image} className="w-8 h-8 rounded-full" />
                        <div>
                          <div className="font-medium">{circle.name}</div>
                          <div className="text-sm text-gray-500">{circle.totalUsers}</div>
                        </div>
                      </div>
                    ),
                  },
                };

                const config = configMap[addType];
                if (!config) return null;

                return (
                  <CustomDropdown
                    data={config.data}
                    value={config.value}
                    onChange={(val) => config.setValue(val)}
                    placeholder={config.placeholder}
                    searchPlaceholder={config.searchPlaceholder}
                    valueKey="id"
                    displayKey="name"
                    searchKey={config.searchKey}
                    multiSelect={true}
                    isSearch={true}
                    renderItem={config.renderItem}
                  />
                );
              })()}
            </div>

            <div className="flex justify-end gap-2 p-4">
              <button
                type="submit"
                className="p-2 sm:w-1/4 w-1/3 rounded-full cursor-pointer text-white bg-gradient-to-r from-[#6D31ED] to-[#3E1C87] hover:opacity-90"
              >
                Add
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default AddModal;