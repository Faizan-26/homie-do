import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

interface DropdownMenuContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownMenuContext = createContext<DropdownMenuContextType | null>(null);

interface DropdownMenuProps {
  children: ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
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

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
}

export function DropdownMenuTrigger({ children, asChild, className, ...props }: DropdownMenuTriggerProps) {
  const context = useContext(DropdownMenuContext);
  
  if (!context) {
    throw new Error("DropdownMenuTrigger must be used within a DropdownMenu");
  }
  
  const { open, setOpen } = context;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(!open);
  };
  
  if (asChild && React.isValidElement(children)) {
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

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

export function DropdownMenuContent({ 
  children, 
  align = "center", 
  className, 
  ...props 
}: DropdownMenuContentProps) {
  const context = useContext(DropdownMenuContext);
  
  if (!context) {
    throw new Error("DropdownMenuContent must be used within a DropdownMenu");
  }
  
  const { open } = context;
  
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

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export function DropdownMenuItem({ children, className, onClick, ...props }: DropdownMenuItemProps) {
  const context = useContext(DropdownMenuContext);
  
  if (!context) {
    throw new Error("DropdownMenuItem must be used within a DropdownMenu");
  }
  
  const { setOpen } = context;
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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

interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  className?: string;
}

export function DropdownMenuLabel({ children, className, ...props }: DropdownMenuLabelProps) {
  return (
    <span
      className={`block px-4 py-2 text-sm font-medium ${className || ''}`}
      {...props}
    >
      {children}
    </span>
  );
}

interface DropdownMenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function DropdownMenuSeparator({ className, ...props }: DropdownMenuSeparatorProps) {
  return (
    <div
      className={`my-1 h-px bg-gray-200 dark:bg-gray-700 ${className || ''}`}
      role="separator"
      {...props}
    />
  );
} 