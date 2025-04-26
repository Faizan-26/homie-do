import React from 'react';
import {
  Dialog,
  DialogPortal,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogClose,
} from './ui/dialog';

/**
 * A wrapper component that ensures dialogs are properly mounted in the DOM
 * This fixes issues with dialogs not appearing when opened
 */
export function DialogWrapper({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent className={`bg-white dark:bg-gray-800 sm:max-w-[425px] ${className || ''}`}>
          {title && (
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">{title}</DialogTitle>
              {description && (
                <DialogDescription className="text-gray-500 dark:text-gray-400">
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>
          )}
          
          {children}
          
          {footer && (
            <DialogFooter>
              {footer}
            </DialogFooter>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

// Re-export the DialogClose for convenience
export { DialogClose }; 