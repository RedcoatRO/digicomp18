import React, { useEffect } from 'react';

/**
 * A custom hook to trap focus within a designated element (e.g., a modal).
 * This is crucial for accessibility (A11y), ensuring keyboard users cannot
 * navigate outside of a modal window unintentionally.
 * @param ref A React ref attached to the container element that should trap focus.
 */
export const useFocusTrap = (ref: React.RefObject<HTMLElement>) => {
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Query for all focusable elements within the container
        const focusableElements = Array.from(
            element.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), textarea, input, select'
            )
        ).filter(el => el.offsetParent !== null); // Ensure they are visible

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Set initial focus on the first element when the modal opens
        firstElement.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            // Only trap focus if Tab key is pressed
            if (e.key !== 'Tab') return;

            // If Shift + Tab is pressed and focus is on the first element,
            // move focus to the last element.
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                // If Tab is pressed and focus is on the last element,
                // move focus to the first element.
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        // Add event listener for keydown
        element.addEventListener('keydown', handleKeyDown);

        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            element.removeEventListener('keydown', handleKeyDown);
        };
    }, [ref]);
};