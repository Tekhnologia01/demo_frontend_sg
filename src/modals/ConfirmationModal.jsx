import { RxCross1 } from "react-icons/rx";

const ConfirmationModal = ({ isOpen, onClose, callbackFn, message, icon }) => {
    // if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
        >
            <div
                className={`bg-white max-w-[550px] p-6 rounded-lg shadow-lg relative transform transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl cursor-pointer"
                    aria-label="Close"
                >
                    <RxCross1 />
                </button>

                <div className="flex items-center justify-center my-4">
                    {icon}
                </div>

                <p className="text-center mb-6 text-lg px-2">{message}</p>

                <div className="flex justify-center gap-3 flex-wrap">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-pointer hover:bg-gray-500 transition"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            callbackFn();
                            onClose();
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600 transition"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;