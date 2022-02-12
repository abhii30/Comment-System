import React, { Component } from "react";
import profileImg from "./icons/user.jpg";
import replyImg from "./icons/reply.jpg";
import "./App.css";
const axios = require("axios");

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      comments: [],
      searchedComments: [],
      isSearch: false,
      newComment: "",
      search: "",
      searchedFor: "",
    };
  }

  // Get all the comments from the database
  componentDidMount = async () => {
    await axios.get("/view-comment").then((res) => {
      this.setState({ comments: res.data.comments });
    });
  };

  // Add a new thread or reply to existing thread
  addComment = async (comment, replyTo) => {
    await axios
      .post("/add-comment", {
        name: this.state.name || "Anonymous",
        comment: comment,
        replyTo: replyTo,
      })
      .then((res) => {
        this.setState({
          name: "",
          newComment: "",
          comments: [...this.state.comments, res.data.comment],
        });
      });
  };

  // Delete a comment
  delComment = async (newComment) => {
    const originalTasks = this.state.comments;
    try {
      const tasks = originalTasks.filter(
        (comments) => comments._id !== newComment
      );
      this.setState({ tasks });
      await axios.delete("/:id", newComment);
    } catch (error) {
      this.setState({ tasks: originalTasks });
      console.log(error);
    }
  };

  // Search for a keyword in all comments
  search = async (search) => {
    await axios
      .post("/search-comment", {
        search: search,
      })
      .then((res) => {
        let searchedComments = res.data.searches;
        for (const comment of res.data.searches) {
          // Comment is a comment and not thread
          if (comment.replyTo !== "All") {
            let thread = this.state.comments.find(
              (msg) => msg._id === comment.replyTo
            );
            let found = searchedComments.find((msg) => msg._id === thread._id);
            if (!found) {
              searchedComments.push(thread);
            }
          }
        }
        this.setState({
          search: "",
          searchedComments: searchedComments,
          searchedFor: search,
          isSearch: true,
        });
      });
  };

  // Convert JS Date to "DD/MM - Time" Format
  timeInFormat = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour24: false,
    });
  };

  // List all comments in a thread
  threadComments = (comments) => {
    let commentArray;
    commentArray = comments.map((comment) => {
      return (
        <div class="row">
          <div class="col-md-1">
            <img
              src={profileImg}
              alt="profileicon"
              class="img-thumbnail"
              style={{ height: "36px" }}
            />
          </div>
          <div className="col-md-2">
            <span className="name">
              <b>{comment.name}</b>
            </span>
          </div>
          <div className="col-md-6">
            <span className="comment1">{comment.comment}</span>
          </div>
          <span class="col-2">{this.timeInFormat(new Date(comment.date))}</span>
          <button
            class="col-auto btn btn-danger btn-md"
            aria-hidden="true"
            onClick={() => this.delComment(comments._id)}
          >
            <i class="bi bi-x-circle"></i>
          </button>
        </div>
      );
    });
    return commentArray;
  };

  // List all threads
  thread = (allComments) => {
    let threadArray, reply;
    if (allComments !== []) {
      const threads = allComments.filter(
        (comment) => comment.replyTo === "All"
      );
      threadArray = threads.map((thread) => {
        const comments = allComments.filter(
          (comment) => comment.replyTo === thread._id
        );
        return (
          <div className="big_container">
            <div class="container">
              <div class="row">
                <div class="col-md-1">
                  <img
                    src={profileImg}
                    alt="profileicon"
                    class="img-thumbnail"
                    style={{ height: "36px" }}
                  />
                </div>
                <div className="col-md-2">
                  <span className="name">
                    <b>{thread.name}</b>
                  </span>
                </div>
                <div className="col-md-6">
                  <span className="comments">{thread.comment}</span>
                </div>
                <span class="col-md-2">
                  {this.timeInFormat(new Date(thread.date))}
                </span>
              </div>
              {this.threadComments(comments)}
              <div class="row">
                <div class="col-md-2">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Name"
                    aria-label="Search"
                    value={this.state.name}
                    onChange={(e) => this.setState({ name: e.target.value })}
                  />
                </div>
                <div class="col-md-8">
                  <textarea
                    type="text"
                    class="form-control form-control-lg"
                    id="txt"
                    placeholder="Reply ..."
                    value={reply}
                    onChange={(e) => (reply = e.target.value)}
                  />
                </div>
                <div class="col-md-1">
                  <img
                    src={replyImg}
                    alt="replyicon"
                    class="replyicon"
                    onClick={() => {
                      this.addComment(reply, thread._id);
                      document.getElementById("txt").value = "";
                    }}
                  />
                </div>
              </div>
            </div>
            <br />
            <br />
          </div>
        );
      });
    }

    return threadArray;
  };

  render() {
    return (
      <div class="container-fluid">
        <div class="row">
          <h1 className="heading">Comment System : </h1>
        </div>
        <br />
        <div class="row">
          <div class="col-auto">
            <img
              src={profileImg}
              class="img-thumbnail"
              style={{ height: "36px" }}
              alt=""
            />
          </div>
          <div class="col-4">
            <form class="form-inline">
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Name"
                aria-label="Search"
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value })}
              />
            </form>
          </div>
        </div>
        <br />
        <div class="row">
          <div class="col-6">
            {" "}
            <textarea
              type="text"
              class="form-control form-control-lg"
              id="text"
              rows="3"
              placeholder="Create a New thread"
              value={this.state.newComment}
              onChange={(e) => this.setState({ newComment: e.target.value })}
            />
          </div>
          <div class="col-auto">
            <img
              style={{ height: "38px" }}
              src={replyImg}
              alt="replyicon"
              className="replyicon"
              onClick={() => this.addComment(this.state.newComment, "All")}
            />
          </div>
        </div>
        <br />
        <div class="row justify-content-end">
          <div class=" col-3">
            <div class="input-group">
              <input
                class="form-control form-control-lg"
                type="Search"
                placeholder="Type a keyword"
                aria-label="Search"
                value={this.state.search}
                onChange={(e) => this.setState({ search: e.target.value })}
                required
              />
              <button
                type="button"
                class="btn btn-lg btn-outline-success"
                onClick={() => this.search(this.state.search)}
              >
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>
        <br />
        {this.state.isSearch === true && (
          <div className="search_bar">
            <h4>Searches for</h4>
            <h4 style={{ color: "blueviolet" }}>"{this.state.searchedFor}"</h4>
            <div class="text-center">
              <button
                type="button"
                class="btn btn-primary btn-lg"
                onClick={() => this.setState({ isSearch: false })}
              >
                Clear Filter
              </button>
            </div>
          </div>
        )}
        {this.state.isSearch === false && this.thread(this.state.comments)}
        {this.state.isSearch === true &&
          this.thread(this.state.searchedComments)}
      </div>
    );
  }
}
