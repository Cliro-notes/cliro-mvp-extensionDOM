// LabelMenu.jsx
import { useState } from 'react';
import { SPACING, TYPOGRAPHY, OPACITY, RADIUS, ANIMATION } from '../../shared/constants/colors.js';

export default function LabelMenu({ originalText }) {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [submenu, setSubmenu] = useState(null);

    const hasText = Boolean(originalText);

    const handleAction = async (action, payload = null) => {
        setLoading(true);

        console.group('🧠 LABEL MENU ACTION');
        console.log('ACTION:', action);
        console.log('PAYLOAD:', payload);
        console.log('TEXT:', originalText);
        console.groupEnd();

        // simulación tipo sendAIRequest
        await new Promise(r => setTimeout(r, 600));

        setResponse({
            action,
            payload,
            preview: originalText?.slice(0, 80) || '[NO TEXT]'
        });

        setLoading(false);
    };

    const styles = {
        menu: {
            display: 'flex',
            alignItems: 'center',
            gap: SPACING.xs,
        },

        item: {
            padding: `${SPACING.xs} ${SPACING.sm}`,
            borderRadius: RADIUS.sm,
            fontSize: TYPOGRAPHY.fontSizeSm,
            cursor: 'pointer',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            transition: `background ${ANIMATION.durationFast} ${ANIMATION.transitionSmooth}`,
        },

        hover: {
            background: OPACITY.dark10,
        },

        response: {
            padding: `${SPACING.xs} ${SPACING.sm}`,
            fontSize: TYPOGRAPHY.fontSizeXs,
            opacity: 0.7,
        }
    };

    /* ---------------- MAIN MENU ---------------- */

    if (loading) {
        return <div style={styles.response}>Processing…</div>;
    }

    if (response) {
        return (
            <div style={styles.response}>
                ✓ {response.action}
            </div>
        );
    }

    if (submenu === 'rewrite') {
        return (
            <div style={styles.menu}>
                {['Shorter', 'More formal', 'More casual'].map(option => (
                    <Item
                        key={option}
                        label={option}
                        styles={styles}
                        onClick={() => handleAction('REWRITE', option)}
                    />
                ))}
                <Item label="← Back" styles={styles} onClick={() => setSubmenu(null)} />
            </div>
        );
    }

    if (submenu === 'translate') {
        return (
            <div style={styles.menu}>
                {['EN', 'ES', 'FR', 'DE'].map(lang => (
                    <Item
                        key={lang}
                        label={lang}
                        styles={styles}
                        onClick={() => handleAction('TRANSLATE', lang)}
                    />
                ))}
                <Item label="← Back" styles={styles} onClick={() => setSubmenu(null)} />
            </div>
        );
    }

    /* ---------------- ROOT MENU ---------------- */

    return (
        <div style={styles.menu}>
            <Item
                label="Explain"
                styles={styles}
                onClick={() => handleAction('EXPLAIN')}
            />
            <Item
                label="Summarize"
                styles={styles}
                onClick={() => handleAction('SUMMARIZE')}
            />
            <Item
                label="Rewrite"
                styles={styles}
                onClick={() => setSubmenu('rewrite')}
            />
            <Item
                label="Translate"
                styles={styles}
                onClick={() => setSubmenu('translate')}
            />
        </div>
    );
}

/* ---------- Item ---------- */

function Item({ label, styles, onClick }) {
    const [hover, setHover] = useState(false);

    return (
        <div
            style={{
                ...styles.item,
                ...(hover ? styles.hover : {})
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            {label}
        </div>
    );
}
