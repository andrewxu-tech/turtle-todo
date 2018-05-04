const User = require('../models/user');

// Displaying all the users (will probably not be in prod, except for possible leaderboard)
function usersIndex(req, res, next) {
  User
    .find()
    .then(user => res.json(user))
    .catch(err => next(err));
}

// Creating a new user
function usersCreate(req, res, next) {
  User
    .create(req.body)
    .then(user => res.status(201).json(user))
    .catch(err => next(err));
}

// Indexing all the tasks for a certain user
function tasksIndex(req, res, next) {
  User
    .findById(req.params.id)
    // .populate('tasks')
    // I don't know why populate isn't required here.
    .then(user => {
      const requiredTasks = [];
      user.tasks.forEach(e => {
        // Insert some sort of validation for times here, some sort of mechanism to check if the timing of the event is required.
        if (e.actionRequired) {
          requiredTasks.push(e);
        }
      });
      res.json(requiredTasks);
    })
    .catch(err => next(err));
}

// Making a new task - it automatically assigns `actionRequired` as true for the new task.
function tasksCreate(req, res, next) {
  User
    .findById(req.params.id)
    .then(user => {
      req.body.actionRequired = true;
      user.tasks.push(req.body);
      return user.save();
    })
    .then(user => res.json(user))
    .catch(err => next(err));
}

//  Finding a particular task by the task Id
function tasksShow(req, res, next) {
  User
    .findById(req.params.id)
    .then(user => {
      const task = user.tasks.id(req.params.taskId);
      res.json(task);
    })
    .catch(err => next(err));
}

// This 'deletion' function will be used for completing a task. It will update the user's score when you do it.
function tasksComplete(req, res, next) {
  User
    .findById(req.params.id)
    .then(user => {
      const task = user.tasks.id(req.params.taskId);
      if (!user.score) {
        user.score = 0;
      }
      user.score += 5;
      if (!user[`${task.title}Score`]) {
        user[`${task.title}Score`] = 0;
      }
      user[`${task.title}Score`] += 5;
      // All of these lines above could be used in the future to determine how to increment the score on the main user data. I think this is actually subject to change depending on the naming conventions we call our tasks etc. For instance, if we do this our task title can't have spaces in it.
      task.actionRequired = false;
      if (!task.recurring) {
        task.remove();
      }
      // For recurring tasks, we might not remove this.
      user.save();
      return res.status(202).json(user);
    })
    .catch(err => next(err));
}

// Remaining tasks:

module.exports = {
  usersIndex: usersIndex,
  usersCreate: usersCreate,
  tasksIndex: tasksIndex,
  tasksCreate: tasksCreate,
  tasksShow: tasksShow,
  tasksComplete: tasksComplete
};
