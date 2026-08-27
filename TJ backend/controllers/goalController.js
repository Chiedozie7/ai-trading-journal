const {
    createGoal,
    getGoals,
    updateGoal,
    deleteGoal,
} = require("../services/goalServices");


const createGoalController = async (req, res) => {
    try {
        const goal = await createGoal(req.id, req.body);

        res.status(201).json(goal);
    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message,
        });
    }
};


const getGoalsController = async (req, res) => {
    try {
        const goals = await getGoals(req.id);

        res.status(200).json(goals);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
};


const updateGoalController = async (req, res) => {
    try {
        const goal = await updateGoal(
            req.id,
            req.params.id,
            req.body
        );

        res.status(200).json(goal);
    } catch (error) {
        console.error(error);

        const status =
            error.message === "Goal not found"
                ? 404
                : 400;

        res.status(status).json({
            message: error.message,
        });
    }
};


const deleteGoalController = async (req, res) => {
    try {
        await deleteGoal(
            req.id,
            req.params.id
        );

        res.status(200).json({
            message: "Goal deleted successfully",
        });
    } catch (error) {
        console.error(error);

        const status =
            error.message === "Goal not found"
                ? 404
                : 400;

        res.status(status).json({
            message: error.message,
        });
    }
};


module.exports = {
    createGoalController,
    getGoalsController,
    updateGoalController,
    deleteGoalController,
};