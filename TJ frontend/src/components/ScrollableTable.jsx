import { useEffect, useRef, useState } from "react";
import "../styles/scrollableTable.css";

function ScrollableTable({ children }) {
    const containerRef = useRef(null);
    const [showFade, setShowFade] = useState(false);

    useEffect(() => {
        const scrollContainer =
            containerRef.current.querySelector(".trades-table-wrapper") ||
            containerRef.current.querySelector(".analytics-table-container");

        if (!scrollContainer) return;

        const updateFade = () => {
            const hasOverflow =
                scrollContainer.scrollWidth > scrollContainer.clientWidth;

            const atEnd =
                scrollContainer.scrollLeft + scrollContainer.clientWidth >=
                scrollContainer.scrollWidth - 2;

            setShowFade(hasOverflow && !atEnd);
        };

        updateFade();

        scrollContainer.addEventListener("scroll", updateFade);
        window.addEventListener("resize", updateFade);

        return () => {
            scrollContainer.removeEventListener("scroll", updateFade);
            window.removeEventListener("resize", updateFade);
        };
    }, []);

    return (
        <div className="scrollable-table" ref={containerRef}>
            {children}
            {showFade && <div className="scroll-fade" />}
        </div>
    );
}

export default ScrollableTable;