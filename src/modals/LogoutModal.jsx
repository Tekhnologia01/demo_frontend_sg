import { RxCross1 } from "react-icons/rx";

const LogoutModal = ({ isOpen, onClose, callbackFn }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur-xs p-4"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-white max-w-[550px] p-6 rounded-lg shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl cursor-pointer"
                    aria-label="Close"
                >
                    <RxCross1 />
                </button>

                <h2 className="text-xl text-center font-semibold mb-4">
                    Confirm Logout
                </h2>
                <p className="text-center mb-6">Choose where you'd like to log out from.</p>

                <div className="flex justify-center gap-3 flex-wrap">
                    <button
                        type="button"
                        onClick={() => {
                            callbackFn();
                            onClose();
                        }}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md cursor-pointer hover:bg-yellow-600 transition"
                    >
                        This device only
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            callbackFn({ "logoutAll": 1 });
                            onClose();
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md cursor-pointer hover:bg-red-700 transition"
                    >
                        From all devices
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;