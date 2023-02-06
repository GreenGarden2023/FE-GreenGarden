import { useState, useEffect } from 'react';

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
  
    useEffect(() => {
      // Set a timeout to delay the update of debouncedValue
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
  
      // Clear the timeout when the component unmounts or the value changes
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
  
    return debouncedValue;
  }

export default useDebounce;