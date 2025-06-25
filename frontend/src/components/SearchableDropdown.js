import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

const SearchableDropdown = ({ 
  apiUrl, 
  placeholder, 
  value, 
  onChange 
}) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(apiUrl);
        const formattedOptions = response.data.map(item => ({
          value: Object.values(item)[0],
          label: Object.values(item)[0]
        }));
        setOptions(formattedOptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  return (
    <Select
      options={options}
      isLoading={isLoading}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      isSearchable
      isClearable
      styles={{
        control: (base) => ({
          ...base,
          minHeight: '42px',
          border: '1px solid #d1d5db',
          borderRadius: '0.5rem',
          '&:hover': { borderColor: '#9ca3af' }
        })
      }}
    />
  );
};

export default SearchableDropdown;
