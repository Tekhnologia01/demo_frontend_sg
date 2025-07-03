import React from 'react';
import Select from 'react-select';

const MultiSelectWithDropdown = ({ value, onChange, options }) => {
    return (
        <Select
            isMulti
            options={options}
            value={options?.filter(option => value.includes(option.value))} // Ensure selected IDs match
            onChange={selectedOptions => onChange(selectedOptions.map(option => option.value))} // Store only IDs
            closeMenuOnSelect={false}
        />
    );
};

export default MultiSelectWithDropdown;
