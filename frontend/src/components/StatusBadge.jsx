function StatusBadge({ status }) {
    return <span className={`status-badge status-${status.toLowerCase().replace(/ /g, '-')}`}>{status}</span>;
}

export default StatusBadge;
