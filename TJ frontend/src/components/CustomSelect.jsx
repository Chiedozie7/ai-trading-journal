import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import "../styles/customSelect.css";

function CustomSelect({
    options,
    value,
    onChange,
    placeholder = "Select..."
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(
        options.findIndex(option => option.value === value)
    );

    const containerRef = useRef(null);

    const selected =
        options.find(option => option.value === value) ||
        { label: placeholder };

    useEffect(() => {
        setHighlightedIndex(
            Math.max(
                0,
                options.findIndex(option => option.value === value)
            )
        );
    }, [value, options]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleKeyDown = (e) => {

        if (!isOpen) {

            if (
                e.key === "Enter" ||
                e.key === " " ||
                e.key === "ArrowDown"
            ) {
                e.preventDefault();
                setIsOpen(true);
            }

            return;
        }

        switch (e.key) {

            case "Escape":
                setIsOpen(false);
                break;

            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex(prev =>
                    Math.min(prev + 1, options.length - 1)
                );
                break;

            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex(prev =>
                    Math.max(prev - 1, 0)
                );
                break;

            case "Enter":
                e.preventDefault();

                onChange(options[highlightedIndex].value);
                setIsOpen(false);

                break;

            default:
                break;
        }
    };

    return (
        <div
            className="custom-select"
            ref={containerRef}
        >

            <button
                type="button"
                className={`select-trigger ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen(prev => !prev)}
                onKeyDown={handleKeyDown}
            >

                <span>
                    {selected.label}
                </span>

                <FiChevronDown className="select-icon" />

            </button>

            {isOpen && (

                <div className="select-menu"
                    role="listbox">

                    {options.map((option, index) => (

                        <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={option.value === value}
                            className={`select-option ${option.value === value
                                ? "selected"
                                : ""
                                } ${index === highlightedIndex
                                    ? "highlighted"
                                    : ""
                                }`}
                            onMouseEnter={() =>
                                setHighlightedIndex(index)
                            }
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </button>

                    ))}

                </div>

            )}

        </div>
    );
}

export default CustomSelect;