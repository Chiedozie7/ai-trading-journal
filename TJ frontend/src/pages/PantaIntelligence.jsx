import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../components/CustomSelect";
import PantaAnalyticsOverview from "../components/PantaAnalyticsOverview";
import PantaIntelligencePanel from "../components/PantaIntelligencePanel";
import PantaOpenTradeInsights from "../components/PantaOpenTradeInsights";
import { directionOptions } from "../data/tradeFormOptions";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import "../styles/analytics.css";
import "../styles/pantaIntelligencePage.css";

const initialTradeIdea = {
    pair: "",
    direction: "buy",
    entryPrice: "",
    stopLoss: "",
    takeProfit: "",
    expectedHoldingPeriod: "",
    pantaAnalysis: null,
};

function PantaIntelligence() {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("check");
    const [enabled, setEnabled] = useState(null);
    const [tradeIdea, setTradeIdea] = useState(initialTradeIdea);
    const [analytics, setAnalytics] = useState(null);
    const [trades, setTrades] = useState([]);
    const [insightsLoading, setInsightsLoading] = useState(false);
    const [insightsError, setInsightsError] = useState("");

    useEffect(() => {
        let isMounted = true;

        axiosPrivate.get("/trades/panta/config")
            .then((response) => {
                if (isMounted) setEnabled(response.data.enabled === true);
            })
            .catch(() => {
                if (isMounted) setEnabled(false);
            });

        return () => {
            isMounted = false;
        };
    }, [axiosPrivate]);

    useEffect(() => {
        if (activeTab !== "insights" || enabled !== true || analytics) return;

        let isMounted = true;

        Promise.all([
            axiosPrivate.get("/analytics/panta"),
            axiosPrivate.get("/trades", { params: { limit: 100, sort: "newest" } }),
        ])
            .then(([analyticsResponse, tradesResponse]) => {
                if (!isMounted) return;
                setAnalytics(analyticsResponse.data);
                setTrades(tradesResponse.data.trades || []);
            })
            .catch(() => {
                if (isMounted) setInsightsError("Panta insights could not be loaded.");
            })
            .finally(() => {
                if (isMounted) setInsightsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [activeTab, analytics, axiosPrivate, enabled]);

    const handleChange = (event) => {
        setTradeIdea((current) => ({
            ...current,
            [event.target.name]: event.target.value,
            pantaAnalysis: null,
        }));
    };

    const handleAnalysisChange = useCallback((pantaAnalysis) => {
        setTradeIdea((current) => ({ ...current, pantaAnalysis }));
    }, []);

    const handleAddToJournal = () => {
        const {
            pair,
            direction,
            entryPrice,
            stopLoss,
            takeProfit,
            expectedHoldingPeriod,
            pantaAnalysis,
        } = tradeIdea;

        navigate("/create-trade", {
            state: {
                pantaPreTrade: {
                    fields: {
                        pair,
                        direction,
                        entryPrice,
                        stopLoss,
                        takeProfit,
                        expectedHoldingPeriod,
                    },
                    analysis: pantaAnalysis,
                },
            },
        });
    };

    return (
        <div className="panta-intelligence-page">
            <header className="panta-page-hero">
                <div>
                    <span className="panta-powered">Powered by Panta</span>
                    <h1>Panta Intelligence</h1>
                    <p>Check market context before execution, then review how alignment relates to journal outcomes.</p>
                </div>
            </header>

            <div className="panta-page-tabs" role="tablist" aria-label="Panta Intelligence sections">
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "check"}
                    className={activeTab === "check" ? "active" : ""}
                    onClick={() => setActiveTab("check")}
                >
                    Pre-Trade Check
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "insights"}
                    className={activeTab === "insights" ? "active" : ""}
                    onClick={() => {
                        if (!analytics) {
                            setInsightsLoading(true);
                            setInsightsError("");
                        }
                        setActiveTab("insights");
                    }}
                >
                    Insights
                </button>
            </div>

            {enabled === false && (
                <div className="panta-empty-state">
                    <strong>Panta Intelligence is currently unavailable</strong>
                    <p>Your normal TradeLedger journal remains fully available.</p>
                </div>
            )}

            {activeTab === "check" && enabled !== false && (
                <div className="panta-check-layout" role="tabpanel">
                    <section className="panta-check-form-card">
                        <div className="panta-section-heading">
                            <span>Step 1</span>
                            <div>
                                <h2>Define the proposed trade</h2>
                                <p>This does not create a journal entry or place a trade.</p>
                            </div>
                        </div>
                        <div className="panta-check-grid">
                            <div className="form-field">
                                <label htmlFor="pantaPair">Asset / Pair</label>
                                <input id="pantaPair" name="pair" placeholder="e.g. BTCUSD" value={tradeIdea.pair} onChange={handleChange} />
                            </div>
                            <div className="form-field">
                                <label>Direction</label>
                                <CustomSelect
                                    options={directionOptions}
                                    value={tradeIdea.direction}
                                    onChange={(value) => handleChange({ target: { name: "direction", value } })}
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="pantaEntry">Proposed Entry</label>
                                <input id="pantaEntry" type="number" name="entryPrice" value={tradeIdea.entryPrice} onChange={handleChange} />
                            </div>
                            <div className="form-field">
                                <label htmlFor="pantaStop">Stop Loss</label>
                                <input id="pantaStop" type="number" name="stopLoss" value={tradeIdea.stopLoss} onChange={handleChange} />
                            </div>
                            <div className="form-field">
                                <label htmlFor="pantaTarget">Take Profit</label>
                                <input id="pantaTarget" type="number" name="takeProfit" value={tradeIdea.takeProfit} onChange={handleChange} />
                            </div>
                            <div className="form-field">
                                <label htmlFor="pantaHolding">Expected Holding Period</label>
                                <input id="pantaHolding" name="expectedHoldingPeriod" placeholder="Optional, e.g. 3 days" value={tradeIdea.expectedHoldingPeriod} onChange={handleChange} />
                            </div>
                        </div>
                    </section>

                    <PantaIntelligencePanel
                        enabled={enabled}
                        tradeIdea={tradeIdea}
                        onAnalysisChange={handleAnalysisChange}
                    />

                    {tradeIdea.pantaAnalysis && tradeIdea.pantaAnalysis.status !== "unavailable" && (
                        <section className="panta-journal-cta">
                            <div>
                                <span>Executed the setup?</span>
                                <h2>Carry this exact pre-trade context into your journal.</h2>
                                <p>The analysis and original timestamp will be attached without running Panta again.</p>
                            </div>
                            <button type="button" onClick={handleAddToJournal}>
                                I took this trade — Add to Journal
                            </button>
                        </section>
                    )}
                </div>
            )}

            {activeTab === "insights" && enabled !== false && (
                <div className="panta-insights-layout" role="tabpanel">
                    {insightsLoading && <p className="panta-loading">Loading Panta insights…</p>}
                    {insightsError && <p className="panta-error">{insightsError}</p>}
                    {analytics && (
                        <>
                            <PantaAnalyticsOverview analytics={analytics} />
                            <PantaOpenTradeInsights trades={trades} />
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default PantaIntelligence;
