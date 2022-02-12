const Comment = require("../models/schema");

exports.viewComments = async (req, res) => {
  try {
    const comments = await Comment.find({});
    res.send({ comments });
  } catch (err) {
    res.send({ message: err });
  }
};

exports.addComment = async (req, res) => {
  const newComment = new Comment({
    name: req.body.name,
    comment: req.body.comment,
    replyTo: req.body.replyTo,
  });
  console.log(newComment._id);
  try {
    await newComment.save();
    res.send({ comment: newComment });
  } catch (err) {
    res.send({ message: err });
  }
};
exports.deleteComment = async (req, res) => {
  try {
  const delComment = await Comment.findByIdAndDelete(req.params.id);
    res.send({ delComment });
  } catch (err) {
    res.send({ message: err });
  }
};

exports.searchComment = async (req, res) => {
  const sComments = await Comment.find({});
  const regEx = req.body.search;
  const reg = new RegExp(regEx, "g");
  let searches = [];
  for (const list of sComments) {
    if (list.comment.match(reg) != null) {
      searches.push(list);
    }
  }
  res.send({ searches });
};
