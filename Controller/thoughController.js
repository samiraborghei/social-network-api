const { Thought, User } = require("../Model");

const thoughtController = {
  // Get all Thoughts
  getAllThought(req, res) {
    Thought
      .find({})
      .populate({path: "reactions",select: "-__v"})
      .select("-__v")
      .sort({ _id: -1 })
      .then((thought) => res.json(thought))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // Get Thought by ID
  getThoughtById({ params }, res) {
    Thought
      .findOne({ _id: params.id })
      .populate({path: "reactions",select: "-__v"})
      .select("-__v")
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: "No thought found with this id!" });
        }
        res.json(thought);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // Create Thought
  createThought({ params, body }, res) {
    Thought
      .create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "Thought created but no user with this id!" });
        }
        res.json({ message: "Thought successfully created!" });
      })
      .catch((err) => res.json(err));
  },

  // Update Thought by ID
  updateThought({ params, body }, res) {
    Thought
      .findOneAndUpdate({ _id: params.id }, body, {
        new: true,
        runValidators: true,
      })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: "No thought found with this id!" });
        }
        res.json(thought);
      })
      .catch((err) => res.json(err));
  },

  // Delete Thought
  deleteThought({ params }, res) {
    Thought
      .findOneAndDelete({ _id: params.id })
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: "No thought found with this id!" });
        }
        return User.findOneAndUpdate(
          { thoughts: params.id },
          { $pull: { thoughts: params.id } },
          { new: true }
        );
      })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "Thought deleted but no user with this id!" });
        }
        res.json({ message: "Thought successfully deleted!" });
      })
      .catch((err) => res.json(err));
  },

  // Add reaction
  addReaction({ params, body }, res) {
    Thought
      .findOneAndUpdate(
        { _id: params.id },
        { $addToSet: { reactions: body } },
        { new: true, runValidators: true }
      )
      .then((thought) => {
        if (!thought) {
          return res.status(404).json({ message: "No thought found with this id" });
        }
        res.json(thought);
      })
      .catch((err) => res.json(err));
  },

  // Delete reaction
  removeReaction({ params }, res) {
    Thought
      .findOneAndUpdate(
        { _id: params.id },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
      )
      .then((thought) => res.json(thought))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;
