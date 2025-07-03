import { useState, useMemo, useEffect, useRef } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6';

const CustomDropdown = ({
  data = [],
  value = [],
  placeholder = "Select",
  searchPlaceholder,
  valueKey = 'id',
  displayKey = valueKey,
  searchKey = 'name',
  multiSelect = false,
  isSearch = false,
  renderItem,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const [dropUp, setDropUp] = useState(false);

  // Normalize selected values
  const selectedValues = multiSelect
    ? Array.isArray(value) ? value : []
    : value;

  const getSelectedItems = () => {
    if (multiSelect) {
      return data.filter((item) => selectedValues.includes(item[valueKey]));
    } else {
      return data.find((item) => item[valueKey] === selectedValues) || null;
    }
  };

  const selectedItems = useMemo(() => getSelectedItems(), [data, value, multiSelect]);

  const isSelected = (item) =>
    multiSelect
      ? selectedValues.includes(item[valueKey])
      : item[valueKey] === selectedValues;

  const handleSelect = (item) => {
    if (multiSelect) {
      const exists = selectedValues.includes(item[valueKey]);
      const updated = exists
        ? selectedValues.filter((val) => val !== item[valueKey])
        : [...selectedValues, item[valueKey]];

      onChange?.(updated);
    } else {
      onChange?.(item[valueKey]);
      setIsOpen(false);
    }
  };

  const removeItem = (item) => {
    if (!multiSelect) return;
    const updated = selectedValues.filter((val) => val !== item[valueKey]);
    onChange?.(updated);
  };

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return data.filter((item) =>
      String(item[searchKey]).toLowerCase().includes(term)
    );
  }, [data, searchTerm, searchKey]);

  // Set dropdown bottom or up based on available space
  const toggleOpen = () => {
    setIsOpen((prev) => {
      if (!prev) {
        // check available space
        const rect = dropdownRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const estimatedDropdownHeight = 240;
        setDropUp(spaceBelow < estimatedDropdownHeight);
      } else {
        setSearchTerm("");
      }
      return !prev;
    });
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input on open
  useEffect(() => {
    if (isOpen && isSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isOpen, isSearch]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Header */}
      <div
        onClick={toggleOpen}
        className="min-h-[40px] border border-gray-300 p-2 flex items-center justify-between gap-1 rounded cursor-pointer bg-white"
      >
        <div className="flex flex-wrap items-center gap-1">
          {multiSelect ? (
            selectedItems?.length === 0 ? (
              <span className="text-gray-400">{placeholder}</span>
            ) : (
              selectedItems.map((item) => (
                <span
                  key={item[valueKey]}
                  className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item[displayKey]}
                  <button
                    className="ml-1 text-blue-600 hover:text-blue-800 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item);
                    }}
                  >
                    &times;
                  </button>
                </span>
              ))
            )
          ) : selectedItems ? (
            <span>{selectedItems[displayKey]}</span>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <span className="text-gray-500 ml-auto">
          {isOpen ? <FaAngleUp /> : <FaAngleDown />}
        </span>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className={`absolute z-50 w-full bg-white rounded shadow max-h-60 overflow-y-auto border border-gray-300 ${dropUp ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
        >
          {isSearch && (
            <div className="p-2">
              <input
                type="text"
                ref={searchInputRef}
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 text-sm outline-none border-0 border-b-1 border-b-gray-300"
              />
            </div>
          )}

          {filteredData.length === 0 ? (
            <div className="p-2 text-sm text-gray-400">No results found</div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item[valueKey]}
                onClick={() => handleSelect(item)}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center ${isSelected(item) ? 'bg-blue-50' : ''
                  }`}
              >
                {multiSelect && (
                  <input
                    type="checkbox"
                    checked={isSelected(item)}
                    readOnly
                    className="mr-2"
                  />
                )}
                {renderItem(item)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;