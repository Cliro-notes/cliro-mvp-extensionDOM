// /content/MenuItems/ResponseDisplay.jsx
import { useState, useEffect, useRef } from 'react';
import { Copy, RefreshCw, ThumbsUp, X } from 'lucide-react';
import { COLORS, OPACITY, SPACING, RADIUS, TYPOGRAPHY, ANIMATION, SHADOWS } from '../../shared/constants/colors.js';

export function ResponseDisplay({
    response,
    onClose,
    variant = 'bubble',
    onBackToMenu
}) {
    const [copyFeedback, setCopyFeedback] = useState(false);
    const [clickedButton, setClickedButton] = useState(null);
    const [likeFeedback, setLikeFeedback] = useState(false);
    const containerRef = useRef(null);

    // DEBUG: Verificar props
    useEffect(() => {
        console.log('ResponseDisplay mounted with:', {
            onClose: typeof onClose,
            onBackToMenu: typeof onBackToMenu,
            variant
        });
    }, []);

    // Only close on outside click - NO on mouse leave
    useEffect(() => {
        const handleClickOutside = (e) => {
            // Solo cerrar si se hace click fuera Y el target no es parte de otro elemento Cliro
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                const isOtherCliroElement = e.target.closest('[data-cliro-element]');
                if (!isOtherCliroElement) {
                    console.log('Click outside detected, calling onClose');
                    if (onClose && typeof onClose === 'function') {
                        onClose();
                    }
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

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
            }, 2000);
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

    const handleClose = (e) => {
        e?.stopPropagation();
        console.log('Close button clicked - ResponseDisplay');

        if (onBackToMenu && typeof onBackToMenu === 'function') {
            console.log('Calling onBackToMenu');
            onBackToMenu();
        } else if (onClose && typeof onClose === 'function') {
            console.log('Calling onClose');
            onClose();
        }
    };

    // Configuraciones por variante
    const variantConfig = {
        bubble: {
            width: '260px',
            maxHeight: '400px',
            background: 'transparent',
            borderRadius: RADIUS.xl,
            padding: SPACING.sm,
            boxShadow: 'none',
            marginBottom: SPACING.sm,
            textContainerMaxHeight: '280px',
            layout: 'vertical',
        },
        label: {
            width: '320px',
            maxHeight: '300px',
            background: COLORS.light,
            borderRadius: RADIUS.lg,
            padding: SPACING.md,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            marginBottom: '0',
            textContainerMaxHeight: '180px',
            layout: 'horizontal',
        }
    };

    const config = variantConfig[variant];

    // Inline styles object
    const styles = {
        container: {
            animation: `slideIn ${ANIMATION.durationNormal} ${ANIMATION.transitionSmooth}`,
            width: config.width,
            maxHeight: config.maxHeight,
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            background: config.background,
            borderRadius: config.borderRadius,
            padding: config.padding,
            boxShadow: config.boxShadow,
            overflow: 'hidden',
            color: COLORS.dark,
            fontFamily: TYPOGRAPHY.fontSans,
            border: variant === 'label' ? `1px solid ${OPACITY.dark10}` : 'none',
            position: 'relative',
            zIndex: 2147483646,
        },
        header: {
            padding: `${SPACING.sm} ${SPACING.md}`,
            background: 'transparent',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: '0',
            borderBottom: `1px solid ${OPACITY.dark10}`,
        },
        headerTitle: {
            fontSize: TYPOGRAPHY.fontSizeSm,
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
            padding: '4px',
            borderRadius: RADIUS.md,
            transition: `all ${ANIMATION.durationFast} ${ANIMATION.transitionSmooth}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: '0',
            width: '24px',
            height: '24px',
        },
        content: {
            flex: '1',
            padding: variant === 'label' ? SPACING.md : `${SPACING.md} ${SPACING.lg}`,
            overflowY: 'auto',
            overflowX: 'hidden',
            background: 'transparent',
            boxSizing: 'border-box',
            maxHeight: config.textContainerMaxHeight,
            width: '100%',
        },
        textContainer: {
            fontSize: variant === 'label' ? TYPOGRAPHY.fontSizeSm : TYPOGRAPHY.fontSizeMd,
            lineHeight: variant === 'label' ? '1.5' : '1.6',
            whiteSpace: 'pre-wrap',
            color: COLORS.dark,
            background: 'transparent',
            padding: variant === 'label' ? '0' : '0',
            borderRadius: '0',
            minHeight: variant === 'label' ? '60px' : '40px',
            boxSizing: 'border-box',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            width: '100%',
            maxWidth: '100%',
            wordWrap: 'break-word',
        },
        footer: {
            padding: `${SPACING.sm} ${SPACING.md}`,
            background: variant === 'label' ? OPACITY.neutral5 : 'transparent',
            display: 'flex',
            gap: SPACING.xs,
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
            flexShrink: '0',
            width: '100%',
            boxSizing: 'border-box',
            borderTop: `1px solid ${OPACITY.dark10}`,
        },
        buttonBase: {
            padding: `${SPACING.xs} ${SPACING.sm}`,
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
            background: variant === 'label' ? OPACITY.neutral10 : 'transparent',
            border: `1px solid ${variant === 'label' ? OPACITY.dark10 : OPACITY.dark20}`,
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

    // CSS animations - CORREGIDAS para mostrar texto blanco cuando está clickeado
    const cssAnimations = `
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-8px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes buttonClick2s {
            0% { 
                background-color: ${variant === 'label' ? OPACITY.neutral10 : 'transparent'}; 
                color: ${COLORS.dark} !important;
                border-color: ${variant === 'label' ? OPACITY.dark10 : OPACITY.dark20} !important;
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
                background-color: ${variant === 'label' ? OPACITY.neutral10 : 'transparent'};
                color: ${COLORS.dark} !important;
                border-color: ${variant === 'label' ? OPACITY.dark10 : OPACITY.dark20} !important;
            }
        }
        
        @keyframes likeButtonClick2s {
            0% { 
                background-color: ${variant === 'label' ? OPACITY.neutral10 : 'transparent'}; 
                color: ${COLORS.dark} !important;
                border-color: ${variant === 'label' ? OPACITY.dark10 : OPACITY.dark20} !important;
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
                background-color: ${variant === 'label' ? OPACITY.neutral10 : 'transparent'};
                color: ${COLORS.dark} !important;
                border-color: ${variant === 'label' ? OPACITY.dark10 : OPACITY.dark20} !important;
                transform: scale(1);
            }
        }
        
        .button-click-2s {
            animation: buttonClick2s 2s ease-out;
        }
        .like-button-click-2s {
            animation: likeButtonClick2s 2s ease-out;
        }
        
        /* Asegurar que el texto sea visible durante la animación */
        .button-click-2s span,
        .like-button-click-2s span {
            color: ${COLORS.light} !important;
        }
        
        .button-click-2s svg,
        .like-button-click-2s svg {
            color: ${COLORS.light} !important;
        }
    `;

    const getButtonAnimationClass = (buttonName) => {
        if (clickedButton !== buttonName) return '';
        return buttonName === 'like' ? 'like-button-click-2s' : 'button-click-2s';
    };

    const getButtonStyle = (buttonName) => {
        const isClicked = clickedButton === buttonName;
        const baseColor = isClicked ? COLORS.light : COLORS.dark;
        const backgroundColor = isClicked ? COLORS.dark : styles.buttonBase.background;
        const borderColor = isClicked ? COLORS.dark : styles.buttonBase.border.slice(-9, -2);

        return {
            ...styles.buttonBase,
            color: baseColor,
            background: backgroundColor,
            borderColor: borderColor,
        };
    };

    return (
        <div ref={containerRef} style={styles.container} data-cliro-element="response-display">
            <style>{cssAnimations}</style>

            {/* Header */}
            <div style={styles.header}>
                <span style={styles.headerTitle}>
                    {variant === 'label' ? 'Respuesta' : 'Response'}
                </span>

                <button
                    onClick={handleClose}
                    style={styles.closeButton}
                    aria-label="Close"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = OPACITY.dark10;
                        e.currentTarget.style.color = COLORS.dark;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                        e.currentTarget.style.color = COLORS.neutral;
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

            {/* Footer */}
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
                            e.currentTarget.style.color = COLORS.dark;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (clickedButton !== 'copy') {
                            e.currentTarget.style.background = getButtonStyle('copy').background;
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = getButtonStyle('copy').borderColor;
                            e.currentTarget.style.color = getButtonStyle('copy').color;
                        }
                    }}
                >
                    <Copy style={{
                        ...styles.icon,
                        color: clickedButton === 'copy' ? COLORS.light : COLORS.dark,
                    }} size={12} />
                    <span style={{ ...styles.buttonText, color: clickedButton === 'copy' ? COLORS.light : COLORS.dark }}>
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
                            e.currentTarget.style.color = COLORS.dark;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (clickedButton !== 'regenerate') {
                            e.currentTarget.style.background = getButtonStyle('regenerate').background;
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = getButtonStyle('regenerate').borderColor;
                            e.currentTarget.style.color = getButtonStyle('regenerate').color;
                        }
                    }}
                >
                    <RefreshCw style={{
                        ...styles.icon,
                        color: clickedButton === 'regenerate' ? COLORS.light : COLORS.dark,
                    }} size={12} />
                    <span style={{ ...styles.buttonText, color: clickedButton === 'regenerate' ? COLORS.light : COLORS.dark }}>
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
                            e.currentTarget.style.color = COLORS.dark;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (clickedButton !== 'like') {
                            e.currentTarget.style.background = getButtonStyle('like').background;
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = getButtonStyle('like').borderColor;
                            e.currentTarget.style.color = getButtonStyle('like').color;
                        }
                    }}
                >
                    <ThumbsUp
                        style={{
                            ...styles.icon,
                            color: clickedButton === 'like' ? COLORS.light : COLORS.dark,
                            fill: likeFeedback ? (clickedButton === 'like' ? COLORS.light : COLORS.dark) : 'none',
                            stroke: clickedButton === 'like' ? COLORS.light : (likeFeedback ? COLORS.dark : COLORS.dark),
                        }}
                        size={12}
                    />
                    <span style={{ ...styles.buttonText, color: clickedButton === 'like' ? COLORS.light : COLORS.dark }}>
                        {likeFeedback ? 'Liked!' : 'Like'}
                    </span>
                </button>
            </div>
        </div>
    );
}