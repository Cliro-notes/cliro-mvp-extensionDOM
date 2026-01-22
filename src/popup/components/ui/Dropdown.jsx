import { useState, useEffect, useRef } from 'react';

export const Dropdown = ({ trigger, children, align = 'right' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const alignment = {
        right: 'right-0',
        left: 'left-0',
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {trigger}
            </div>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsOpen(false)}
                    />
                    <div
                        className={`absolute ${alignment[align]} top-10 w-48 bg-dark border border-light/20 rounded-lg overflow-hidden py-1 z-40 shadow-lg`}
                    >
                        {children}
                    </div>
                </>
            )}
        </div>
    );
};