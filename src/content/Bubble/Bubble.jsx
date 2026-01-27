import { useState, useRef, useEffect } from "react";
import { BubbleMenu } from "./BubbleMenu.jsx";
import { StateService } from "../../shared/stateService.js";
import { COLORS, OPACITY, SPACING, RADIUS, TYPOGRAPHY, ANIMATION, SHADOWS } from "../../shared/constants/colors.js";

export default function Bubble({ isSelected, originalText, getImageUrl, onOpenChange }) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ x: 200, y: 200 });
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [allowAutoClose, setAllowAutoClose] = useState(true);
    const [isBubbleVisible, setIsBubbleVisible] = useState(true);

    const bubbleRef = useRef();
    const dragOffset = useRef({ x: 0, y: 0 });
    const hoverTimeoutRef = useRef(null);
    const clickOutsideTimeoutRef = useRef(null);

    // Cargar y escuchar cambios en la visibilidad de la burbuja
    useEffect(() => {
        // Cargar estado inicial
        const loadVisibility = async () => {
            try {
                const visible = await StateService.getBubbleVisibility();
                setIsBubbleVisible(visible);
            } catch (error) {
                console.error('Error loading bubble visibility:', error);
                setIsBubbleVisible(true); // Default to visible on error
            }
        };
        loadVisibility();

        // Escuchar cambios en tiempo real
        const cleanupListener = StateService.onVisibilityChanged((isVisible) => {
            setIsBubbleVisible(isVisible);

            // Si la burbuja se oculta y está abierta, cerrarla
            if (!isVisible && open) {
                setOpen(false);
                onOpenChange?.(false);
                setAllowAutoClose(true);
            }
        });

        return cleanupListener;
    }, [open, onOpenChange]);

    // Hover effect - open on hover
    useEffect(() => {
        if (!isBubbleVisible) return; // Si no es visible, no hacer nada

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
    }, [isHovering, open, onOpenChange, allowAutoClose, isBubbleVisible]);

    // Drag effect
    useEffect(() => {
        const move = (e) => {
            if (dragging) {
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
    }, [dragging]);

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
        const clickable = e.target.closest("[data-clickable], [data-submenu], [data-menu-item]");
        if (clickable) return;

        setDragStart({ x: e.clientX, y: e.clientY });
        setDragging(true);
        dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
        e.stopPropagation();
    };

    const handleMouseEnter = () => {
        if (!isBubbleVisible) return;
        setIsHovering(true);
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const handleClick = (e) => {
        if (!isBubbleVisible) return;

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

    // Si la burbuja no es visible, no renderizar nada
    if (!isBubbleVisible) {
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
            width: "85%",
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