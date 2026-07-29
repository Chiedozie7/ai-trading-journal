

function StatCard({
    title,
    value,
    subtitle,
    className = "",
}) {
    return (
        <div className={`stat-card ${className}`}>
            <h3>{title}</h3>
            <p>{value}</p>

            {subtitle && <small>{subtitle}</small>}
        </div>
    );
}

export default StatCard;