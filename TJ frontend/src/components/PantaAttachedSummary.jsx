import {
    getPantaAlignmentMeta,
} from "../utils/pantaDisplay";
import "../styles/pantaAttachedSummary.css";

function PantaAttachedSummary({ analysis }) {
    if (!analysis) return null;

    const alignment = getPantaAlignmentMeta(analysis.pantaAlignmentScore);
    const analyzedAt = analysis.analyzedAt
        ? new Date(analysis.analyzedAt).toLocaleString()
        : "Timestamp unavailable";

    return (
        <aside className="panta-attached-summary" aria-label="Attached Panta pre-trade context">
            <div>
                <span className="panta-powered">Powered by Panta</span>
                <h2>Pre-Trade Context Attached</h2>
                <p>
                    Captured {analyzedAt}. Saving this journal entry preserves that original context and timestamp.
                </p>
            </div>
            <div className={`panta-attached-score panta-attached-${alignment.tone}`}>
                <strong>{analysis.pantaAlignmentScore} — {alignment.label}</strong>
                <span>{analysis.markets.length} relevant market{analysis.markets.length === 1 ? "" : "s"}</span>
            </div>
            <p className="panta-attached-disclaimer">
                Panta Alignment is contextual agreement, not win probability.
            </p>
        </aside>
    );
}

export default PantaAttachedSummary;
