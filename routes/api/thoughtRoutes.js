const router = require("express").Router();
const {
  getAllThought,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require("../../Controller/thoughController");

// GET: Get all thoughts
// POST: Creatte a thought
// /api/thoughts
router.route("/").get(getAllThought).post(createThought);

// GET: Get a thought by ID
// PUT: Update a thought
// DELETE: Delete a thought
// /api/thoughts/:id
router.route("/:id").get(getThoughtById).put(updateThought).delete(deleteThought);

// POST: Add a reaction 
// /api/thoughts/reactions/:id
router.route("/reactions/:id").post(addReaction);

// DELETE: Delete a reaction
// /api/thoughts/reactions/:id/:reactionId
router.route("/reactions/:id/:reactionId").delete(removeReaction);

module.exports = router;
