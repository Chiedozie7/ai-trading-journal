import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import GoalCard from "../components/GoalCard";
import "../styles/goals.css";
import GoalModal from "../components/GoalModal";

const Goals = () => {
    const axiosPrivate = useAxiosPrivate();

    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchGoals = async () => {
        try {
            setLoading(true);

            const response = await axiosPrivate.get("/goals");

            setGoals(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    return (
        <div className="goals-page">

            <div className="goals-header">

                {goals.length > 0 && (
                    <button
                        className="primary-btn goals-new-btn"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + New Goal
                    </button>
                )}

            </div>

            {loading ? (
                <div className="goals-empty-state">
                    <p>Loading goals...</p>
                </div>
            ) : goals.length === 0 ? (
                <div className="goals-empty-state">
                    <h3>No goals yet</h3>

                    <p>
                        Create your first goal and track your
                        progress automatically as you trade.
                    </p>

                    <button
                        className="primary-btn"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Create Goal
                    </button>
                </div>
            ) : (
                <div className="goals-grid">
                    {goals.map((goal) => (
                        <GoalCard
                            key={goal._id}
                            goal={goal}
                            onUpdate={fetchGoals}
                        />
                    ))}
                </div>
            )}

            {isModalOpen && (
                <GoalModal
                    onClose={() => setIsModalOpen(false)}
                    onCreated={fetchGoals}
                />
            )}

        </div>
    );
};

export default Goals;