// Bubble.jsx
import { useState, useRef, useEffect } from "react";
import { BubbleMenu } from "./BubbleMenu.jsx";
import { StateService } from "../../shared/stateService.js";
import { COLORS, OPACITY, SPACING, RADIUS, TYPOGRAPHY, ANIMATION, SHADOWS } from "../../shared/constants/colors.js";
import { EXTENSION_DEFAULT_ENABLED } from "../MenuItems/constants.js";

export default function Bubble({ isSelected, originalText, getImageUrl, onOpenChange }) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ x: 200, y: 200 });
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [allowAutoClose, setAllowAutoClose] = useState(true);
    const [isBubbleVisible, setIsBubbleVisible] = useState(true);
    const [isExtensionEnabled, setIsExtensionEnabled] = useState(false);

    const bubbleRef = useRef();
    const dragOffset = useRef({ x: 0, y: 0 });
    const hoverTimeoutRef = useRef(null);
    const clickOutsideTimeoutRef = useRef(null);

    // Cargar y escuchar estado de la extensión
    useEffect(() => {
        const loadExtensionState = async () => {
            try {
                const enabled = await StateService.getExtensionEnabled();
                setIsExtensionEnabled(enabled);
            } catch (error) {
                console.error('Error loading extension state:', error);
                setIsExtensionEnabled(EXTENSION_DEFAULT_ENABLED);
            }
        };

        loadExtensionState();

        // Escuchar cambios en estado de la extensión
        const cleanupExtensionListener = StateService.onExtensionEnabledChanged((isEnabled) => {
            setIsExtensionEnabled(isEnabled);

            // Si extensión se apaga, cerrar burbuja si está abierta
            if (!isEnabled && open) {
                setOpen(false);
                onOpenChange?.(false);
                setAllowAutoClose(true);
            }
        });

        return cleanupExtensionListener;
    }, [open, onOpenChange]);

    // Cargar y escuchar cambios en la visibilidad de la burbuja
    useEffect(() => {
        // Cargar estado inicial
        const loadVisibility = async () => {
            try {
                const visible = await StateService.getBubbleVisibility();
                setIsBubbleVisible(visible);
            } catch (error) {
                console.error('Error loading bubble visibility:', error);
                setIsBubbleVisible(true);
            }
        };
        loadVisibility();

        // Escuchar cambios en tiempo real
        const cleanupBubbleListener = StateService.onBubbleVisibilityChanged((isVisible) => {
            setIsBubbleVisible(isVisible);

            // Si la burbuja se oculta y está abierta, cerrarla
            if (!isVisible && open) {
                setOpen(false);
                onOpenChange?.(false);
                setAllowAutoClose(true);
            }
        });

        return () => {
            cleanupBubbleListener?.();
        };
    }, [open, onOpenChange]);

    // Hover effect - open on hover (solo si extensión y burbuja están habilitadas)
    useEffect(() => {
        if (!isExtensionEnabled || !isBubbleVisible) {
            // Si la extensión o burbuja están deshabilitadas, cerrar si está abierta
            if (open) {
                setOpen(false);
                onOpenChange?.(false);
            }
            return;
        }

        if (isHovering && !open && allowAutoClose) {
            hoverTimeoutRef.current = setTimeout(() => {
                setOpen(true);
                onOpenChange?.(true);
            }, 300);
        } else if (!isHovering && open && allowAutoClose) {
            hoverTimeoutRef.current = setTimeout(() => {
                setOpen(false);
                onOpenChange?.(false);
            }, 500);
        }

        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, [isHovering, open, onOpenChange, allowAutoClose, isExtensionEnabled, isBubbleVisible]);

    // Drag effect (solo si extensión y burbuja están habilitadas)
    useEffect(() => {
        const move = (e) => {
            if (dragging && isExtensionEnabled && isBubbleVisible) {
                setPos({
                    x: e.clientX - dragOffset.current.x,
                    y: e.clientY - dragOffset.current.y,
                });
            }
        };
        const up = () => setDragging(false);

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
        };
    }, [dragging, isExtensionEnabled, isBubbleVisible]);

    // Click outside effect - closes bubble immediately
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (bubbleRef.current && !bubbleRef.current.contains(e.target)) {
                // Immediate close on click outside
                setOpen(false);
                onOpenChange?.(false);
                setAllowAutoClose(true);

                // Clear any pending hover timeouts
                if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current);
                }
            }
        };

        // Use mousedown instead of click for faster response
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onOpenChange]);

    // Event handlers
    const handleMouseDown = (e) => {
        // Verificar si extensión y burbuja están habilitadas
        if (!isExtensionEnabled || !isBubbleVisible) return;

        const clickable = e.target.closest("[data-clickable], [data-submenu], [data-menu-item]");
        if (clickable) return;

        setDragStart({ x: e.clientX, y: e.clientY });
        setDragging(true);
        dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
        e.stopPropagation();
    };

    const handleMouseEnter = () => {
        if (!isExtensionEnabled || !isBubbleVisible) return;
        setIsHovering(true);
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const handleClick = (e) => {
        if (!isExtensionEnabled || !isBubbleVisible) return;

        // If bubble is closed and user clicks (not drag), open it immediately
        if (!open && !dragging) {
            // Clear any pending hover timeout
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
            // Open immediately on click
            setOpen(true);
            onOpenChange?.(true);
            setAllowAutoClose(false);
        }
        e.stopPropagation();
    };

    // Handle manual close from BubbleMenu
    const handleManualClose = () => {
        setOpen(false);
        onOpenChange?.(false);
        setAllowAutoClose(true);
    };

    // Cleanup
    useEffect(() => {
        return () => {
            onOpenChange?.(false);
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
            if (clickOutsideTimeoutRef.current) {
                clearTimeout(clickOutsideTimeoutRef.current);
            }
        };
    }, [onOpenChange]);

    // Si la extensión no está habilitada O la burbuja no es visible, no renderizar
    if (!isExtensionEnabled || !isBubbleVisible) {
        return null;
    }

    const bubbleImage = isSelected ?
        getImageUrl('/icons/confusedCliro.png') :
        getImageUrl('/icons/cliro.png');

    const styles = {
        container: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            zIndex: 2147483647,
            isolation: "isolate",
            color: COLORS.dark,
            fontFamily: TYPOGRAPHY.fontSans,
        },
        bubble: {
            pointerEvents: "auto",
            position: "absolute",
            left: pos.x,
            top: pos.y,
            width: open ? 260 : 56,
            height: open ? "auto" : 56,
            borderRadius: open ? RADIUS.xl : "50%",
            padding: open ? SPACING.sm : 0,
            background: COLORS.light,
            boxShadow: SHADOWS.lg,
            transition: dragging ? "none" : `all ${ANIMATION.durationNormal} ${ANIMATION.transitionSmooth}`,
            cursor: dragging ? "grabbing" : open ? "default" : "grab",
            userSelect: "none",
            overflow: "visible",
            zIndex: 10000,
        },
        imageContainer: {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            overflow: "hidden",
            background: 'inherit',
        },
        image: {
            width: "80%",
            objectFit: "contain",
            pointerEvents: "none",
        },
    };

    return (
        <div style={styles.container}>
            <div
                ref={bubbleRef}
                onMouseDown={handleMouseDown}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={styles.bubble}
            >
                {!open && (
                    <div style={styles.imageContainer}>
                        <img
                            src={bubbleImage}
                            alt="Cliro Bubble"
                            style={styles.image}
                        />
                    </div>
                )}

                {open && (
                    <BubbleMenu
                        originalText={originalText}
                        onClose={handleManualClose}
                        isSelected={isSelected}
                    />
                )}
            </div>
        </div>
    );
}