const express = require("express");

const router = express.Router();

const {
    createNoteController,
    getNotesController,
    getNoteController,
    updateNoteController,
    deleteNoteController,
} = require("../../controllers/noteController");


router.get("/", getNotesController);
router.post("/", createNoteController);
router.get("/:id", getNoteController);
router.put("/:id", updateNoteController);
router.delete("/:id", deleteNoteController);


module.exports = router;