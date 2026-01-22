export function TextPreview({ text }) {
    return (
        <div style={{
            padding: 12,
            borderRadius: 10,
            marginBottom: 8,
            maxHeight: 80,
            overflow: "hidden",
            fontSize: 12,
            color: "var(--color-dark)"
        }}>
            <div style={{ opacity: 0.6, fontSize: 11 }}>Selected text:</div>
            <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {text.length > 35 ? `${text.slice(0, 35)}...` : text}
            </div>
        </div>
    );
}