import { decrypt } from "../services/decrypt";
import { FiChevronRight } from "react-icons/fi";
import { HiOutlineHome } from "react-icons/hi";

const Breadcrumb = ({ breadcrumbs, handleRootClick, handleBreadcrumbClick }) => {
    return (
        <div className="px-4 py-2 flex flex-wrap items-center gap-1 text-gray-600">
            <button
                onClick={handleRootClick}
                className={`font-medium flex items-center gap-1 hover:text-[#6D31ED] transition cursor-pointer ${!breadcrumbs.length && "text-black"
                    }`}
            >
                <HiOutlineHome size={18} className="mb-[3px]" />
                Home
            </button>

            {breadcrumbs.map((crumb, idx) => (
                <div key={crumb.folder_id} className="flex items-center gap-1">
                    <FiChevronRight className="text-gray-400" />
                    <button
                        onClick={() => {
                            handleBreadcrumbClick(idx);
                        }}
                        className={`font-medium hover:text-[#6D31ED] transition cursor-pointer ${idx === breadcrumbs.length - 1 && "text-black"
                            }`}
                    >
                        {decrypt(crumb.folder_name)}
                    </button>
                </div>
            ))}
        </div>
    )
}

export default Breadcrumb;