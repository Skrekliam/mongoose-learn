const mongoose = require("mongoose");
const express = require("express");
const Blog = require("./models/blog");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const dbURI =
  "mongodb+srv://skrekliam:test1234@cluster0.x2gg7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("connected to db");
    app.listen(3000, () => console.log("started server at port 3000"));
  })
  .catch((err) => console.log(err));

//mongoose routes

app.get("/blogs/create", (req, res) => {
  res.render("createBlog");
});

app.post("/blogs/create", (req, res) => {
  const blog = new Blog(req.body);

  blog
    .save()
    .then(() => res.redirect("/blogs"))
    .catch((err) => console.log(err));
});

app.get("/blogs/:id", (req, res) => {
  Blog.findById(String(req.params.id))
    .then((result) => {
      res.render("details", { blog: result });
    })
    .catch((err) => console.log(err));
});

app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/blogs" });
    })
    .catch((err) => console.log(err));
});

app.get("/blogs", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("index", { blogs: result });
    })
    .catch((err) => console.log(err));
});

app.get("/", (req, res) => {
  res.redirect("/blogs");
});
