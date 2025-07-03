import LOGO from "../assets/logo.png";
import { FaRegBell } from "react-icons/fa6";
import { FaSortDown } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/users/authSlice";
import toast from "react-hot-toast";
import { CgProfile } from "react-icons/cg";
import { RiLockPasswordLine } from "react-icons/ri";
import { ImSwitch } from "react-icons/im";
import LogoutModal from "../modals/LogoutModal.jsx";
import { decrypt } from "../services/decrypt.js";
import axiosClient from "../services/axiosInstance.js";
import { RxHamburgerMenu } from "react-icons/rx";
import { formatEpochToLargestUnit } from "../utils/epochUtils.js";
import { useQuery } from "@tanstack/react-query";

const Header = ({ headerHeight }) => {
  const renderHeaders = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Groups", path: "/groups" },
    { name: "Folders", path: "/folders" },
  ];

  const { profile } = useSelector((state) => state.user);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const notifDropdownRef = useRef(null);
  const headerDropdownRef = useRef(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleNotifictaion = () => {
    setIsNotifOpen((prev) => !prev);
  };

  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [notifyId, setNotifyId] = useState(null);

  const fetchNotifications = async (limit = 5) => {
    try {
      const res = await axiosClient.get(
        `/notification?page=${page}&limit=${limit}`
      );

      if (res.data?.data.length === 0) {
        setHasMore(false);
      } else {
        setNotifications((prev) => [...prev, ...res.data?.data]);
      }
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  };

  const readNotification = async (notificationId) => {
    await toast.promise(axiosClient.put(`/notification/${notificationId}`), {
      loading: "",
      success: (res) => {
        setNotifications((prev) =>
          prev.map((n) =>
            n.notification_id === notificationId
              ? { ...n, notification_read_status: 0 }
              : n
          )
        );
        return res?.data?.message || "Notification Read";
      },
      error: (err) => {
        return err?.response?.data?.message || "Failed to read notification";
      },
    });
  };

  const { data: notificationData } = useQuery({
    queryKey: ["notification", notifyId],
    queryFn: () => readNotification(notifyId),
    enabled: !!notifyId && notifications.find(n => n.notification_id === notifyId)?.notification_read_status !== 0,
    keepPreviousData: true,
    gcTime: 0,
    staleTime: 0,
  });

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  useEffect(() => {
    const currentPath = location.pathname;
    const foundIndex = renderHeaders.findIndex((item) =>
      currentPath.startsWith(item.path)
    );
    if (foundIndex !== -1) {
      setSelectedIndex(foundIndex);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }

      const isClickOnNotifIcon = notifRef.current?.contains(target);
      const isClickOnNotifDropdown = notifDropdownRef.current?.contains(target);
      if (!isClickOnNotifIcon && !isClickOnNotifDropdown) {
        setIsNotifOpen(false);
      }

      if (
        headerDropdownRef.current &&
        !headerDropdownRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async (payload) => {
    await toast.promise(dispatch(logout(payload)).unwrap(), {
      loading: "Logging out...",
      success: (res) => {
        window.location.reload();
        return res?.data?.message || "Logout successful";
      },
      error: (err) => {
        return err?.data?.message || "Logout failed";
      },
    });
  };

  return (
    <div
      style={{ height: headerHeight }}
      className="bg-[#FFFFFFB2] flex items-center justify-center relative"
    >
      <div className="flex justify-between items-center px-4 w-full">
        <div className="flex items-center gap-2 cursor-pointer">
          <div
            className="md:hidden block hover:bg-[#d5c2ff] rounded-full p-2 cursor-pointer transition relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <RxHamburgerMenu size={22} />
          </div>
          <div
            className="flex items-center justify-center"
            onClick={() => navigate("/dashboard")}
          >
            <img src={LOGO} alt="" className="h-[40px] w-[40px]" />
            <h4 className="md:flex hidden font-bold text-lg text-[#6D31ED]">
              Smart Gallery
            </h4>
          </div>
        </div>

        <div className="flex md:gap-10 gap-8 items-center">
          <div className="md:flex hidden justify-center items-center md:gap-4 gap-3">
            {renderHeaders?.map((item, index) => (
              <div className="flex flex-col" key={index}>
                <p
                  className={`${
                    index === selectedIndex && "text-[#6D31ED] font-semibold"
                  } px-4 py-2 cursor-pointer hover:text-[#6D31ED] transition`}
                  onClick={() => {
                    setSelectedIndex(index);
                    navigate(item.path);
                  }}
                >
                  {item.name}
                </p>
                {index === selectedIndex && (
                  <span className="w-full h-1 rounded-t-full bg-[#6d31ed]"></span>
                )}
              </div>
            ))}
          </div>

          {isMenuOpen && (
            <div
              ref={headerDropdownRef}
              className="absolute top-16 left-4 right-4 bg-white rounded-lg shadow-md p-4 z-50 md:hidden w-fit"
            >
              {renderHeaders?.map((item, index) => (
                <p
                  key={index}
                  className={`px-4 py-2 cursor-pointer hover:text-[#6D31ED] transition ${
                    index === selectedIndex
                      ? "text-[#6D31ED] font-semibold"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedIndex(index);
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                >
                  {item.name}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-5">
          <div className="relative">
            <div
              onClick={toggleNotifictaion}
              ref={notifRef}
              // className="hover:bg-[#d5c2ff] rounded-full p-2 cursor-pointer transition relative"
            >
              <div className="hover:bg-[#d5c2ff] rounded-full p-2 cursor-pointer transition relative">
                <FaRegBell size={22} className="relative" />
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6D31ED] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6D31ED]"></span>
                </span>
              </div>
              {isNotifOpen && (
                <div
                  ref={notifDropdownRef}
                  className="absolute sm:right-0 right-[-196px] top-12 sm:w-96 w-80 bg-white shadow-lg border border-gray-200 rounded-xl z-60"
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-[#6D31ED]">
                      Notifications
                    </h3>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications?.length > 0 ? (
                      notifications.map((notif, idx) => (
                        <div
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (notif.notification_read_status !== 0) {
                              setNotifyId(notif?.notification_id);
                            }
                          }}
                          className={`flex items-start gap-3 p-4 my-1 transition cursor-pointer ${
                            notif.notification_read_status === 0
                              ? "bg-white"
                              : "bg-gray-100"
                          }`}
                        >
                          <img
                            src={decrypt(notif?.created_by_photo)}
                            alt="avatar"
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-semibold">
                                {decrypt(notif?.created_by_name)}
                              </span>{" "}
                              {decrypt(notif?.notification_message)}
                            </p>
                            <div className="flex justify-between items-center mt-1">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${notif?.statusColor}`}
                              >
                                {notif.status}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatEpochToLargestUnit(notif?.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center p-2 text-gray-600">
                        No notification
                      </p>
                    )}

                    {!(notifications?.length < 5) && hasMore && (
                      <div className="p-2 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPage((prev) => prev + 1);
                          }}
                          className="text-sm text-blue-600 hover:underline cursor-pointer"
                        >
                          Load More
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={toggleDropdown}
            ref={dropdownRef}
          >
            <div className="h-10 w-10">
              <img
                src={decrypt(profile?.user_photo_path)}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[14px] w-full">
                  {decrypt(profile?.user_name)}
                </p>
                <FaSortDown />
              </div>
              <p className="text-xs text-gray-600">Premium</p>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-5 w-fit top-15 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 no-underline"
                >
                  <div className="flex gap-2">
                    <span>
                      <CgProfile size={18} />
                    </span>
                    <span>Profile</span>
                  </div>
                </Link>
                <Link
                  to="/change-password"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 no-underline"
                >
                  <div className="flex gap-2">
                    <span>
                      <RiLockPasswordLine size={18} />
                    </span>
                    <span>Change Password</span>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    openModal();
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-100 cursor-pointer"
                >
                  <div className="flex gap-2">
                    <span>
                      <ImSwitch size={18} />
                    </span>
                    <span>Logout</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <LogoutModal
        isOpen={isModalOpen}
        onClose={closeModal}
        callbackFn={handleLogout}
      />
    </div>
  );
};

export default Header;