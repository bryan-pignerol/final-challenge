const express = require('express');

const app = express();
app.use(express.json());

let tasks = [
  {
    id: 1,
    title: 'Prepare GitHub workshop',
    description: 'Finish the slides',
    status: 'todo'
  },
  {
    id: 2,
    title: 'Write CI workflow',
    description: 'Configure GitHub Actions',
    status: 'in-progress'
  },
  {
    id: 3,
    title: 'Review Pull Request',
    description: 'Review teammate changes',
    status: 'done'
  }
];

const VALID_STATUSES = ['todo', 'in-progress', 'done'];

app.get('/health', (req, res) => {
  res.json({
    status: 'ok'
  });
});

app.get('/tasks', (req, res) => {
  const { status } = req.query;

  if (status === undefined) {
    return res.json(tasks);
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
    });
  }

  const filteredTasks = tasks.filter((task) => task.status === status);
  return res.json(filteredTasks);
});


app.get('/tasks/:id', (req, res) => {
  const task = tasks.find((item) => item.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  return res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex((item) => item.id === Number(req.params.id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  return res.status(204).send();
});

app.post('/tasks', (req, res) => {
  const { title, description, status = 'todo' } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Invalid task status. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  const task = {
    id: tasks.length ? Math.max(...tasks.map((item) => item.id)) + 1 : 1,
    title,
    description,
    status
  };

  tasks.push(task);
  return res.status(201).json(task);
});

app.patch('/tasks/:id', (req, res) => {
  const task = tasks.find((item) => item.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const allowedFields = ['title', 'description', 'status'];
  const keys = Object.keys(req.body);

  if (keys.length === 0) {
    return res.status(400).json({ error: 'No fields provided to update' });
  }

  const hasInvalidKey = keys.some((key) => !allowedFields.includes(key));
  if (hasInvalidKey) {
    return res.status(400).json({ error: 'Invalid request structure' });
  }

  const { title, description, status } = req.body;

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid task status. Must be one of: ${VALID_STATUSES.join(', ')}`
    });
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Invalid title' });
    }
  }

  if (description !== undefined) {
    if (typeof description !== 'string') {
      return res.status(400).json({ error: 'Invalid description' });
    }
  }

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid task status. Must be one of: ${VALID_STATUSES.join(', ')}` });
    }
  }

  if (title !== undefined) {
    task.title = title.trim();
  }
  if (description !== undefined) {
    task.description = description;
  }
  if (status !== undefined) {
    task.status = status;
  }

  return res.json(task);
});


if (require.main === module) {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Task API listening on port ${port}`);
  });
}

module.exports = { app };
