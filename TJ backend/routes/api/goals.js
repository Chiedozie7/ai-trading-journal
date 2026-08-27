const express = require("express");

const router = express.Router();

const {
    createGoalController,
    getGoalsController,
    updateGoalController,
    deleteGoalController,
} = require("../../controllers/goalController");


router.get("/", getGoalsController);
router.post("/", createGoalController);
router.put("/:id", updateGoalController);
router.delete("/:id", deleteGoalController);


module.exports = router;