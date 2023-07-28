const { User, Thought } = require('../models');

module.exports = {
    getUser(req, res) {
        User.find({})
        .then((user) => res.json(user))
        .catch((err) => res.status(400).json(err));
    },
    getSingleUser(req, res) {
        User.findOne({_id: req.params.userId})
        .populate("thoughts")
        .populate('friends')
        .select("-__v")
        .then((user) =>
        !user
        ?res.status(404).json({ message: "NO user found with this id!"})
        : res.json(user)
        )
        .catch((err) => res.status(400).json(err));
    },
    // creating user
    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    // updating user
    updateUser(req, res) {
        User.findOneAndUpdate(
        { _id: req.params.userId}, 
        { $set: req.body },
        { runValidators: true, new: true}
        )
        .then((user) =>
        !user
        ? res.status(404).json({ message: "No user found with this id!"})
        : res.json(user)
        )
        .catch((err) => res.status(400).json(err));
    },
    // delete a user
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId})
        .then((user) =>
        !user
        ? res.status(404).json({ message:"No user found with this id!"})
        : Thought.deleteMany({ _id: { $in: user.thoughts }})
        )
        .then(() => res.json({ message: "User and user thoughts deleted!"}))
        .catch((err) => res.status(400).json(err));
    },
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId},
            { $addToSet: { friends: req.params.friendId}},
            { runValidators: true, new: true}
        )
        .then((user) =>
        !user
        ? res.status(404).json({ message: "No user found with this id!"})
        :res.json(user)
        )
        .catch((err) => res.status(400).json(err));
    },
    // remove a friend from a users frined list
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            {$pull: { friends: req.params.friendId}},
            { runValidators: true, new: true}
        )
        .then((user) =>
        !user
        ? res.status(404).json({ message: "No user found with this id!"})
        : res.json(user)
        )
        .catch((err) => res.status(400).json(err));
    }
};