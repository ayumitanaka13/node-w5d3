const express = require("express");
const utils = require("./util/task-schema");

const app = express();

app.use(express.json());

const tasks = [
  { id: 1, name: "Task 1", completed: true },
  { id: 2, name: "Task 2", completed: true },
  { id: 3, name: "Task 3", completed: false },
];

// GET
app.get("/api/tasks", (req, res) => {
  res.send(tasks);
});

// GET BY ID
app.get("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const task = tasks.find((task) => task.id === +taskId);
  if (!task) return res.status(404).send("Not Exist");
  res.send(task);
});

// POST
app.post("/api/tasks", (req, res) => {
  const { error } = utils.validateTask(req.body);
  if (error)
    return res.status(400).send("The name should be more than 3 characters");

  const task = {
    id: tasks.length + 1,
    name: req.body.name,
    completed: req.body.completed,
  };
  tasks.push(task);
  res.status(201).send(task);
});

// PUT
app.put("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const task = tasks.find((task) => task.id === +taskId);
  if (!task) return res.status(404).send("Not Exist");

  const { error } = utils.validateTask(req.body);
  if (error)
    return res.status(400).send("The name should be more than 3 characters");

  task.name = req.body.name;
  task.completed = req.body.completed;

  res.send(task);
});

// PATCH
app.patch("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const task = tasks.find((task) => task.id === +taskId);
  if (!task) return res.status(404).send("Not Exist");

  const { error } = utils.validateTask(req.body);
  if (error)
    return res.status(400).send("The name should be more than 3 characters");

  task.name = req.body.name;

  if (req.body.completed) {
    task.completed = req.body.completed;
  }
  res.send(task);
});

// DELETE
app.delete("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const task = tasks.find((task) => task.id === +taskId);
  if (!task) return res.status(404).send("Not Exist");

  const index = tasks.indexOf(task);
  tasks.splice(index, 1);
  res.send(tasks);
});

const PORT = process.env.PORT || 8080;
module.exports = app.listen(PORT, () =>
  console.log(`Server listening on Port: ${PORT}`)
);
