export default function() {
    const isDev = (/* import.meta.env.DEV || */ window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1"));
    return isDev ? "development" : "production";
}


