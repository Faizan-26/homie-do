import React from 'react';

const FormInput = ({ 
  label, 
  id, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error,
  required = false 
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700/30'} 
          rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6347] focus:border-transparent 
          transition-all duration-200 bg-white dark:bg-[#252b3b] text-gray-900 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-500`}
        placeholder={placeholder}
        required={required}
      />
      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormInput; 