// components/ui/Switch.jsx
export const Switch = ({ checked, onChange, disabled = false }) => {
    return (
        <button
            onClick={() => !disabled && onChange(!checked)}
            disabled={disabled}
            className={`relative w-10 h-5 rounded-full transition-all duration-300 ${checked ? 'bg-dark' : 'bg-neutral/20'
                } ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}
            aria-checked={checked}
            role="switch"
        >
            <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-light rounded-full transform transition-all duration-300 ${checked ? 'translate-x-5' : ''
                    }`}
            />
        </button>
    );
};