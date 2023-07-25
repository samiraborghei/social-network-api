const { User, Thought } = require("../Model");

const userController = {
  // Get all users
  getAllUser(req, res) {
    User
      .find({})
      .populate({path: "friends",select: "-__v"})
      .select("-__v").sort({ _id: -1})
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // Get a user by ID
  getUserById({ params }, res) {
    User
      .findOne({ _id: params.id})
      .populate({path: "thoughts",select: "-__v"})
      .populate({path: "friends",select: "-__v"})
      .select("-__v")
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "No user found with this id!"});
        }
        res.json(user);
      })
      .catch((err) => res.sendStatus(400));
  },

  // Create user
  createUser({ body }, res) {
    User
      .create(body)
      .then((user) => res.json(user))
      .catch((err) => res.json(err));
  },

  // Update user by id
  updateUser({ params, body }, res) {
    User
      .findOneAndUpdate({ _id: params.id }, body, {new: true,runValidators: true})
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "No user found with this id!" });
        }
        res.json(user);
      })
      .catch((err) => res.json(err));
  },

  // Delete user
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "No user found with this id!" });
        }
        // Delete thoughts
        return Thought.deleteMany({ _id: { $in: user.thoughts } });
      })
      .then(() => {
        res.json({ message: "User and associated thoughts deleted!" });
      })
      .catch((err) => res.json(err));
  },

  // Add friend
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "No user found with this id!" });
        }
        res.json(user);
      })
      .catch((err) => res.json(err));
  },

  // Delete friend
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "No user found with this id!" });
        }
        res.json(user);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = userController;