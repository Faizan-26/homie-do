import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const DropdownMenuContext = createContext(null);

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left" ref={ref}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, asChild, className, ...props }) {
  const { open, setOpen } = useContext(DropdownMenuContext);
  
  const handleClick = (e) => {
    e.preventDefault();
    setOpen(!open);
  };
  
  if (asChild) {
    return React.cloneElement(children, {
      onClick: handleClick,
      "aria-expanded": open,
      "aria-haspopup": true,
      ...props
    });
  }
  
  return (
    <button
      type="button"
      className={`inline-flex justify-center items-center ${className || ''}`}
      onClick={handleClick}
      aria-expanded={open}
      aria-haspopup="true"
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({ 
  children, 
  align = "center", 
  className, 
  ...props 
}) {
  const { open } = useContext(DropdownMenuContext);
  
  if (!open) return null;
  
  const alignmentClasses = {
    start: "left-0 origin-top-left",
    center: "left-1/2 -translate-x-1/2 origin-top",
    end: "right-0 origin-top-right"
  };
  
  const alignClass = alignmentClasses[align] || alignmentClasses.center;

  return (
    <div
      className={`absolute z-50 mt-2 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${alignClass} ${className || ''}`}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="options-menu"
      {...props}
    >
      <div className="py-1">{children}</div>
    </div>
  );
}

export function DropdownMenuItem({ children, className, onClick, ...props }) {
  const { setOpen } = useContext(DropdownMenuContext);
  
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    setOpen(false);
  };
  
  return (
    <button
      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${className || ''}`}
      role="menuitem"
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuLabel({ children, className, ...props }) {
  return (
    <span
      className={`block px-4 py-2 text-sm font-medium ${className || ''}`}
      {...props}
    >
      {children}
    </span>
  );
}

export function DropdownMenuSeparator({ className, ...props }) {
  return (
    <div
      className={`my-1 h-px bg-gray-200 dark:bg-gray-700 ${className || ''}`}
      role="separator"
      {...props}
    />
  );
} 