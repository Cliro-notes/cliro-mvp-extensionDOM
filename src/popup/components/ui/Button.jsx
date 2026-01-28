export const Button = ({
    children,
    variant = 'secondary',
    size = 'md',
    onClick,
    disabled = false,
    icon: Icon,
    className = '',
    iconPosition = 'left',
    ...props
}) => {
    const baseStyles = 'rounded-lg font-medium transition-all duration-200 flex items-center justify-center animate-fade-in';

    const variants = {
        primary: 'bg-neutral/10 text-dark border border-neutral/30 hover:bg-neutral/20 hover:border-neutral/40 disabled:opacity-30 disabled:cursor-not-allowed animate-pulse-subtle',
        secondary: 'bg-light/10 text-dark border border-neutral/20 hover:bg-light/20 hover:text-dark hover:border-neutral/30 disabled:opacity-30 disabled:cursor-not-allowed',
        ghost: 'bg-transparent text-dark hover:bg-light/10 disabled:opacity-30 disabled:cursor-not-allowed',
        bug: 'bg-light/10 text-dark border border-neutral/20 hover:text-red-600 hover:border-red-600/60 disabled:opacity-30 disabled:cursor-not-allowed',
        suggestion: 'bg-light/10 text-dark border border-neutral/20 hover:text-blue-600 hover:border-blue-600/60 disabled:opacity-30 disabled:cursor-not-allowed',
        status: 'bg-light/10 text-dark border border-neutral/20 hover:border-green-500/60 disabled:opacity-30 disabled:cursor-not-allowed',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs gap-1.5',
        md: 'px-3 py-2 text-xs gap-2',
        lg: 'px-3 py-2.5 text-sm gap-2.5',
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-3.5 h-3.5',
        lg: 'w-4 h-4',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {Icon && iconPosition === 'left' && (
                <Icon className={`${iconSizes[size]} flex-shrink-0`} />
            )}
            <span className="whitespace-nowrap">{children}</span>
            {Icon && iconPosition === 'right' && (
                <Icon className={`${iconSizes[size]} flex-shrink-0`} />
            )}
        </button>
    );
};