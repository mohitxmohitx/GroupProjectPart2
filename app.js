const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Task = require("./model/task");
const task = require("./model/task");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/MyTask", {
  useNewUrlParser: "true",
});
mongoose.connection.on("error", (err) => {
  console.log("err", err);
});
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected");
});

app.get("/", async (req, res) => {
  const tasks = await Task.find({});
  console.log(tasks);
  res.render("home.ejs", { tasks });
});

app.post("/", async (req, res) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ error: "Task cannot be empty" });
  }

  const addTask = new Task({ task });
  await addTask.save();
  res.redirect("/");
});

app.put("/:id", async (req, res) => {
  const { task } = req.body;
  const updateTask = await Task.findByIdAndUpdate(req.params.id, {
    task: task,
  });
  await updateTask.save();
  res.redirect("/");
});

app.delete("/:id", async (req, res) => {
  const taskId = req.params.id;
  await Task.findByIdAndRemove(taskId);
  res.redirect("/");
});

app.listen("3000", (req, res) => {
  console.log("Listening on port 3000");
});
