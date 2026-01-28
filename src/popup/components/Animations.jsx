// /popup/components/Animations.jsx
export const Animations = () => {
    return (
        <style>
            {`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes pulse-subtle {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.8; }
            }
            @keyframes slide-in {
                from { transform: translateX(-20px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes scale-in {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            @keyframes rotate-chevron {
                from { transform: rotate(0deg); }
                to { transform: rotate(180deg); }
            }
            @keyframes bounce-subtle {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-2px); }
            }
            .animate-fade-in {
                animation: fade-in 0.3s ease-out;
            }
            .animate-pulse-subtle {
                animation: pulse-subtle 2s ease-in-out infinite;
            }
            .animate-slide-in {
                animation: slide-in 0.3s ease-out;
            }
            .animate-scale-in {
                animation: scale-in 0.2s ease-out;
            }
            .animate-rotate-chevron {
                animation: rotate-chevron 0.2s ease-out;
            }
            .animate-bounce-subtle {
                animation: bounce-subtle 1s ease-in-out infinite;
            }
            `}
        </style>
    );
};