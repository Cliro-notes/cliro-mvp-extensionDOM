// components/BackgroundElements.jsx
import {
    Pencil,
    Notebook,
    FileText,
    PenTool,
    BookOpen,
    Feather,
    Highlighter,
} from 'lucide-react';

export const BackgroundElements = () => {
    return (
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
            {/* Grid pattern */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `
            linear-gradient(to right, var(--color-neutral) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-neutral) 1px, transparent 1px)
          `,
                    backgroundSize: '20px 20px',
                }}
            />

            {/* Pencil marks - positioned with translate to prevent movement */}
            <div className="absolute top-10 left-8 w-10 h-0.5 bg-dark transform -rotate-6 translate-y-0 translate-x-0" />
            <div className="absolute top-16 left-12 w-6 h-0.5 bg-dark transform rotate-3 translate-y-0 translate-x-0" />
            <div className="absolute top-24 right-16 w-8 h-0.5 bg-dark transform -rotate-12 translate-y-0 translate-x-0" />

            {/* Icons - using fixed positioning for true stickiness */}
            <div className="fixed top-32 right-24 w-5 h-5">
                <Pencil className="w-full h-full text-dark" />
            </div>
            <div className="fixed bottom-44 left-32 w-6 h-6">
                <Notebook className="w-full h-full text-dark" />
            </div>
            <div className="fixed top-1/3 right-12 w-8 h-8">
                <FileText className="w-full h-full text-dark" />
            </div>
            <div className="fixed bottom-32 right-16 w-6 h-6">
                <PenTool className="w-full h-full text-dark" />
            </div>
            <div className="fixed top-28 left-1/2 transform -translate-x-1/2 w-8 h-8">
                <BookOpen className="w-full h-full text-dark" />
            </div>
            <div className="fixed bottom-24 left-16 w-6 h-6">
                <Feather className="w-full h-full text-dark" />
            </div>
            <div className="fixed top-1/2 left-12 w-8 h-8">
                <Highlighter className="w-full h-full text-dark" />
            </div>
        </div>
    );
};