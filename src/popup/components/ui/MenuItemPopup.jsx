import { ChevronRight } from 'lucide-react';

export const MenuItemPopup = ({
    children,
    icon: Icon,
    label,
    onClick,
    badge,
    chevron,
    className = '',
    variant = 'dark',
}) => {
    const variantStyles = {
        light: {
            container: 'hover:bg-light/20 text-light',
            icon: 'text-light',
            label: 'text-light',
            subtext: 'text-light/60',
            chevron: 'text-light/60',
        },
        dark: {
            container: 'hover:bg-light/10 text-dark animate-fade-in',
            icon: 'text-dark',
            label: 'text-dark',
            subtext: 'text-neutral',
            chevron: 'text-neutral',
        },
    };

    const styles = variantStyles[variant];

    return (
        <div
            className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-all duration-150 text-sm ${styles.container} ${className}`}
            onClick={onClick}
        >
            <div className="flex items-center gap-3">
                {Icon && <Icon className={`w-3.5 h-3.5 ${styles.icon}`} />}
                <div className="flex-1">
                    <p className={`font-medium ${styles.label}`}>{label}</p>
                    {children && <p className={`text-xs mt-0.5 ${styles.subtext}`}>{children}</p>}
                </div>
            </div>
            <div className="flex items-center gap-2">
                {badge}
                {chevron && <ChevronRight className={`w-3 h-3 ${styles.chevron}`} />}
            </div>
        </div>
    );
};