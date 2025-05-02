export default function LoadingSpinner({ size = "medium", color = "white" }) {
    const sizeMap = {
        small: "30px",
        medium: "50px",
        large: "70px"
    };
    return (
        <div style={{
            width: sizeMap[size],
            height: sizeMap[size],
            border: `6px solid ${color === "white" ? "#ffffff44" : "#007bff44"}`,
            borderTopColor: color === "white" ? "#fff" : "#007bff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
        }} />
    );
}