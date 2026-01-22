import { useState, useEffect } from 'react';
import { Copy, RefreshCw, ThumbsUp, X } from 'lucide-react';
import { COLORS, OPACITY, SPACING, RADIUS, TYPOGRAPHY, ANIMATION, SHADOWS } from '../../shared/constants/colors.js';

export function ResponseDisplay({ response, onClose }) {
    const [copyFeedback, setCopyFeedback] = useState(false);
    const [clickedButton, setClickedButton] = useState(null);
    const [likeFeedback, setLikeFeedback] = useState(false);

    // Extract and clean text
    const getDisplayText = () => {
        if (!response) return 'No response';

        if (typeof response === 'string') {
            return response.trim().replace(/\n\s*\n\s*\n/g, '\n\n');
        }

        let text = '';
        if (response.text) text = response.text;
        else if (response.content) text = response.content;
        else if (response.result) text = response.result;
        else if (response.message) text = response.message;
        else if (response.data) text = response.data;
        else if (Array.isArray(response)) text = response.join('\n');
        else {
            for (const key in response) {
                if (typeof response[key] === 'string' && response[key].length > 10) {
                    text = response[key];
                    break;
                }
            }
            if (!text) text = JSON.stringify(response, null, 2);
        }

        return text.toString().trim()
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            .replace(/^\s+|\s+$/gm, '');
    };

    const displayText = getDisplayText();

    // Effect to reset click animation
    useEffect(() => {
        if (clickedButton) {
            const timer = setTimeout(() => {
                setClickedButton(null);
            }, 2000); // 2 seconds
            return () => clearTimeout(timer);
        }
    }, [clickedButton]);

    const handleCopy = async () => {
        setClickedButton('copy');
        await navigator.clipboard.writeText(displayText);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
    };

    const handleRegenerate = () => {
        setClickedButton('regenerate');
        console.log('Regenerate');
    };

    const handleLike = () => {
        setClickedButton('like');
        setLikeFeedback(!likeFeedback);
    };

    // Inline styles object using constants
    const styles = {
        container: {
            animation: `slideIn ${ANIMATION.durationNormal} ${ANIMATION.transitionSmooth}`,
            marginBottom: SPACING.sm,
            width: '100%',
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            background: 'transparent',
            borderRadius: RADIUS.lg,
            overflow: 'hidden',
            color: COLORS.dark,
            fontFamily: TYPOGRAPHY.fontSans,
        },
        header: {
            padding: `${SPACING.md} ${SPACING.lg}`,
            background: 'transparent',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: '0',
        },
        headerTitle: {
            fontSize: TYPOGRAPHY.fontSizeMd,
            fontWeight: '500',
            color: COLORS.dark,
            opacity: '0.95',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        closeButton: {
            background: 'none',
            border: 'none',
            color: COLORS.neutral,
            cursor: 'pointer',
            padding: SPACING.xs,
            borderRadius: RADIUS.md,
            transition: `all ${ANIMATION.durationFast} ${ANIMATION.transitionSmooth}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: '0',
        },
        content: {
            flex: '1',
            padding: `0 ${SPACING.lg}`,
            overflowY: 'auto',
            overflowX: 'hidden',
            background: 'transparent',
            boxSizing: 'border-box',
            maxHeight: '280px',
            width: '100%',
        },
        textContainer: {
            fontSize: TYPOGRAPHY.fontSizeMd,
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            color: COLORS.dark,
            background: OPACITY.neutral10,
            padding: SPACING.lg,
            borderRadius: RADIUS.md,
            minHeight: '40px',
            boxSizing: 'border-box',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            width: '100%',
            maxWidth: '100%',
            wordWrap: 'break-word',
            backdropFilter: 'blur(4px)',
        },
        footer: {
            padding: `${SPACING.md} ${SPACING.lg}`,
            background: 'transparent',
            display: 'flex',
            gap: SPACING.sm,
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
            flexShrink: '0',
            width: '100%',
            boxSizing: 'border-box',
        },
        buttonBase: {
            padding: `${SPACING.sm} ${SPACING.md}`,
            borderRadius: RADIUS.md,
            fontSize: TYPOGRAPHY.fontSizeXs,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: SPACING.xs,
            transition: `all ${ANIMATION.durationFast} ${ANIMATION.transitionSmooth}`,
            fontWeight: '500',
            flex: '1',
            minWidth: '0',
            justifyContent: 'center',
            boxSizing: 'border-box',
            overflow: 'hidden',
            fontFamily: 'inherit',
            color: COLORS.dark,
            background: 'transparent',
            border: `1px solid ${OPACITY.dark20}`,
        },
        buttonText: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: TYPOGRAPHY.fontSizeXs,
        },
        icon: {
            width: '12px',
            height: '12px',
            flexShrink: '0',
        },
    };

    // CSS animations as style tag
    const cssAnimations = `
        @keyframes slideIn {
            from { 
                opacity: 0; 
                transform: translateY(-8px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
        @keyframes buttonClick2s {
            0% { 
                background-color: transparent !important; 
                color: ${COLORS.dark} !important;
                border-color: ${OPACITY.dark20} !important;
            }
            10% { 
                background-color: ${COLORS.dark} !important; 
                color: ${COLORS.light} !important;
                border-color: ${COLORS.dark} !important;
            }
            90% { 
                background-color: ${COLORS.dark} !important;
                color: ${COLORS.light} !important;
                border-color: ${COLORS.dark} !important;
            }
            100% { 
                background-color: transparent !important;
                color: ${COLORS.dark} !important;
                border-color: ${OPACITY.dark20} !important;
            }
        }
        @keyframes likeButtonClick2s {
            0% { 
                background-color: transparent !important; 
                color: ${COLORS.dark} !important;
                border-color: ${OPACITY.dark20} !important;
            }
            10% { 
                background-color: ${COLORS.dark} !important; 
                color: ${COLORS.light} !important;
                border-color: ${COLORS.dark} !important;
                transform: scale(1.05);
            }
            90% { 
                background-color: ${COLORS.dark} !important;
                color: ${COLORS.light} !important;
                border-color: ${COLORS.dark} !important;
                transform: scale(1.05);
            }
            100% { 
                background-color: transparent !important;
                color: ${COLORS.dark} !important;
                border-color: ${OPACITY.dark20} !important;
                transform: scale(1);
            }
        }
        .button-click-2s {
            animation: buttonClick2s 2s ease-out !important;
        }
        .like-button-click-2s {
            animation: likeButtonClick2s 2s ease-out !important;
        }
    `;

    // Helper to get button animation class
    const getButtonAnimationClass = (buttonName) => {
        if (clickedButton !== buttonName) return '';
        return buttonName === 'like' ? 'like-button-click-2s' : 'button-click-2s';
    };

    // Helper to get button style based on state
    const getButtonStyle = (buttonName) => {
        const isClicked = clickedButton === buttonName;
        const isLikeClicked = buttonName === 'like' && isClicked;

        return {
            ...styles.buttonBase,
            color: isClicked ? COLORS.light : COLORS.dark,
            background: isClicked ? COLORS.dark : 'transparent',
            borderColor: isClicked ? COLORS.dark : OPACITY.dark20,
        };
    };

    return (
        <div style={styles.container}>
            <style>{cssAnimations}</style>

            {/* Header */}
            <div style={styles.header}>
                <span style={styles.headerTitle}>
                    Response
                </span>

                <button
                    onClick={onClose}
                    style={styles.closeButton}
                    aria-label="Close"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = OPACITY.dark10;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                    }}
                >
                    <X style={styles.icon} size={14} />
                </button>
            </div>

            {/* Content */}
            <div style={styles.content}>
                <div style={styles.textContainer}>
                    {displayText}
                </div>
            </div>

            {/* Buttons */}
            <div style={styles.footer}>
                <button
                    onClick={handleCopy}
                    className={getButtonAnimationClass('copy')}
                    style={getButtonStyle('copy')}
                    onMouseEnter={(e) => {
                        if (clickedButton !== 'copy') {
                            e.currentTarget.style.background = OPACITY.dark10;
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.borderColor = OPACITY.dark30;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (clickedButton !== 'copy') {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = OPACITY.dark20;
                        }
                    }}
                >
                    <Copy style={{
                        ...styles.icon,
                        color: clickedButton === 'copy' ? COLORS.light : COLORS.dark,
                    }} size={12} />
                    <span style={styles.buttonText}>
                        {copyFeedback ? 'Copied!' : 'Copy'}
                    </span>
                </button>

                <button
                    onClick={handleRegenerate}
                    className={getButtonAnimationClass('regenerate')}
                    style={getButtonStyle('regenerate')}
                    onMouseEnter={(e) => {
                        if (clickedButton !== 'regenerate') {
                            e.currentTarget.style.background = OPACITY.dark10;
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.borderColor = OPACITY.dark30;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (clickedButton !== 'regenerate') {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = OPACITY.dark20;
                        }
                    }}
                >
                    <RefreshCw style={{
                        ...styles.icon,
                        color: clickedButton === 'regenerate' ? COLORS.light : COLORS.dark,
                    }} size={12} />
                    <span style={styles.buttonText}>
                        Regenerate
                    </span>
                </button>

                <button
                    onClick={handleLike}
                    className={getButtonAnimationClass('like')}
                    style={getButtonStyle('like')}
                    onMouseEnter={(e) => {
                        if (clickedButton !== 'like') {
                            e.currentTarget.style.background = OPACITY.dark10;
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.borderColor = OPACITY.dark30;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (clickedButton !== 'like') {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = OPACITY.dark20;
                        }
                    }}
                >
                    <ThumbsUp
                        style={{
                            ...styles.icon,
                            color: clickedButton === 'like' ? COLORS.light : COLORS.dark,
                            fill: likeFeedback ? COLORS.dark : 'none',
                            stroke: likeFeedback ? COLORS.dark : (clickedButton === 'like' ? COLORS.light : COLORS.dark),
                        }}
                        size={12}
                    />
                    <span style={styles.buttonText}>
                        {likeFeedback ? 'Liked!' : 'Like'}
                    </span>
                </button>
            </div>
        </div>
    );
}