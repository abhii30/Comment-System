const router = require("express").Router();
const {
  viewComments,
  addComment,
  deleteComment,
  searchComment,
} = require("../Controllers/Comment");

router.get("/view-comment", viewComments);
router.post("/add-comment", addComment);
router.delete("/:id", deleteComment);
router.post("/search-comment", searchComment);

module.exports = router;
