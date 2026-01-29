export function LoadingAnimation() {
    return (
        <div
            style={{
                height: 42,
                borderRadius: 10,
                padding: "0 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.6
            }}
        >
            <span>Thinking…</span>
        </div>
    );
}
