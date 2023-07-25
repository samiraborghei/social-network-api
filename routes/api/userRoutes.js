const router = require("express").Router();
const {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require("../../Controller/userController");

// GET: Get all users
// POST: Create a user
// /api/users
router.route("/").get(getAllUser).post(createUser);

// GET: Get a user by ID
// PUT: Update a user
// /api/users/:id
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

// POST: Add a friend
// DELETE: Remove a friend
// /api/users/:userId/friends/:friendId
router.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend);

module.exports = router;
