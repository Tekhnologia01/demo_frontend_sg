import { IoIosSearch } from "react-icons/io";

const Searchbar = ({ searchTerm, setSearchTerm, title, placeholder, type = "text" }) => {
    return (
        <>
            {
                title && <p className="text-center px-2 mb-6">{title}</p>
            }
            <div className="border border-[#6D31ED] shadow-sm rounded-full w-full flex items-center gap-2 p-2 px-2 h-11">
                <IoIosSearch className="text-lg h-7 w-7 text-white flex justify-center items-center p-1 rounded-full bg-[#6D31ED]" />
                <input
                    type={type}
                    value={searchTerm}
                    placeholder={placeholder}
                    className="border-0 outline-0 w-full text-[15px]"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </>
    )
}

export default Searchbar;