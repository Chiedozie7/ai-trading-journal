import "../styles/avatar.css";

function Avatar({ username, size = "md" }) {
    const initial = username?.charAt(0).toUpperCase() || "?";

    return (
        <div className={`avatar avatar-${size}`}>
            {initial}
        </div>
    );
}

export default Avatar;