import { useEffect, useState } from "react";

function LoadingState() {
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);function LoadingState() {
    return (
        <div className="loading-state">
            <div className="loading-spinner"></div>
        </div>
    );
}

export default LoadingState;

    if (!showLoader) {
        return null;
    }

    return (
        <div className="loading-state">
            <div className="loading-spinner"></div>
        </div>
    );
}

export default LoadingState;