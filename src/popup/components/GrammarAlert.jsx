// components/GrammarAlert.jsx
import { AlertCircle } from 'lucide-react';

export const GrammarAlert = ({ errorCount }) => {
    if (errorCount <= 0) return null;

    const getSeverity = (count) => {
        if (count >= 5) return 'high';
        if (count >= 3) return 'medium';
        return 'low';
    };

    const severity = getSeverity(errorCount);

    const styles = {
        high: {
            border: 'border-status-attention/20',
            bg: 'bg-status-attention/10',
            icon: 'text-status-attention',
            text: 'text-status-attention',
        },
        medium: {
            border: 'border-status-warning/20',
            bg: 'bg-status-warning/10',
            icon: 'text-status-warning',
            text: 'text-status-warning',
        },
        low: {
            border: 'border-status-good/20',
            bg: 'bg-status-good/10',
            icon: 'text-status-good',
            text: 'text-status-good',
        },
    };

    return (
        <div className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-light/10 backdrop-blur-sm bg-light/90 ${styles[severity].border}`}>
            <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded ${styles[severity].bg}`}>
                    <AlertCircle className={`w-3.5 h-3.5 ${styles[severity].icon}`} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <p className={`text-xs font-medium ${styles[severity].text}`}>
                            {errorCount} issues detected
                        </p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${styles[severity].bg} ${styles[severity].text}`}>
                            {severity}
                        </span>
                    </div>
                    <p className="text-xs text-neutral mt-0.5">Review suggestions</p>
                </div>
            </div>
        </div>
    );
};