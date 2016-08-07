// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Todo = require('./models/todo');

// Connect to the todos MongoDB
mongoose.connect('mongodb://testuser:123qweasd@ds147975.mlab.com:47975/todo1');

// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Create our Express router
var router = express.Router();

// Initial dummy route for testing
// http://localhost:3000/api
router.get('/', function(req, res) {
  res.json({ message: 'You have nothing todo!' }); 
});

// Create a new route with the prefix /todos
var todosRoute = router.route('/todos');

// Create endpoint /api/todos for POSTS
todosRoute.post(function(req, res) {
  console.log(req.body);
  // Create a new instance of the Todo model
  var todo = new Todo();

  // Set the todo properties that came from the POST data
  todo.name = req.body.name;
  todo.description = req.body.description;
  todo.priority = req.body.priority;
  todo.subtasks = req.body.subtasks;
  todo.dateAdded = req.body.dateAdded;
  todo.dateToDo = req.body.dateToDo;
  todo.done = req.body.done;
  todo.comments = req.body.comments;
  

  // Save the todo and check for errors
  todo.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Todo added to the database!', data: todo });
  });
});



// Create endpoint /api/todos for GET
todosRoute.get(function(req, res) {
  // Use the Todo model to find all todo
  Todo.find(function(err, todos) {
    if (err)
      res.send(err);
    var tempTodos = [];
    todos.forEach(function(todo){
      tempTodos.push({
        name: todo.name,
        priority: todo.priority,
        done: todo.done,
        _id: todo._id
      })
    })


    res.json(tempTodos);
  });
});

// Create a new route with the /todos/:todo_id prefix
var todoRoute = router.route('/todos/:todo_id');

// Create endpoint /api/todos/:todo_id for GET
todoRoute.get(function(req, res) {
  // Use the Todo model to find a specific todo
  Todo.findById(req.params.todo_id, function(err, todo) {
    if (err)
      res.send(err);

    res.json(todo);
  });
});

// Create endpoint /api/todos/:todo_id for PUT
todoRoute.put(function(req, res) {
  // Use the Todo model to find a specific todo
  Todo.findById(req.params.todo_id, function(err, todo) {
    if (err)
      res.send(err);

    console.log(req.params.todo_id);
    // Update the existing todo quantity
    if(req.body.name){
      todo.name = req.body.name;
    }
    if(req.body.description){
      todo.description = req.body.description;
    }
    if(req.body.priority){
      todo.priority = req.body.priority;
    }
    if(req.body.subtasks){
      todo.subtasks = req.body.subtasks;
    }
    if(req.body.done){
      todo.done = req.body.done;
    }
    if(req.body.dateToDo){
      todo.dateToDo = req.body.dateToDo;
    }
    if(req.body.comments){
      todo.comments = req.body.comments;
    }


    // Save the todo and check for errors
    todo.save(function(err) {
      if (err)
        res.send(err);

      console.log(todo);

      res.json(todo);
    });
  });
});

// Create endpoint /api/todos/:todo_id for DELETE
todoRoute.delete(function(req, res) {
  // Use the Todo model to find a specific todo and remove it
  Todo.findByIdAndRemove(req.params.todo_id, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Todo removed from the database!' });
  });
});

var commentsRoute = router.route('/todos/:todo_id/comment');

commentsRoute.post(function(req, res) {
  console.log(req.body);
  // Create a new instance of the Todo model
  Todo.findById(req.params.todo_id, function(err, todo) {
    if (err)
      res.send(err);

    if(req.body.comment){
      todo.comments.push({
        comment: req.body.comment
      })
    }

    // Save the todo and check for errors
    todo.save(function(err) {
      if (err)
        res.send(err);

      console.log(todo);

      res.json(todo);
    });
  });
});

var commentRoute = router.route('/todos/:todo_id/comment/:comment_id');

commentRoute.delete(function(req, res) {
  // Create a new instance of the Todo model
  Todo.findById(req.params.todo_id, function(err, todo) {
    if (err)
      res.send(err);

    var commentPlace = -1;

    todo.comments.forEach(function(comment, i){
      if(comment._id == req.params.comment_id){
        commentPlace = i;
      }
    })

    if(commentPlace > -1) {
      todo.comments.splice(commentPlace, 1);
      todo.save(function(err) {
        if (err)
          res.send(err);
        res.json(todo);
      });
    } else {
      res.send("No comment with this id");
    }

    //todo.subtasks[subtaskPlace] = {subtask: req.body.subtask}; 
    // Save the todo and check for errors
    
  });
});



var subtasksRoute = router.route('/todos/:todo_id/subtask');

subtasksRoute.post(function(req, res) {
  console.log(req.body);
  // Create a new instance of the Todo model
  Todo.findById(req.params.todo_id, function(err, todo) {
    if (err)
      res.send(err);

    if(req.body.subtask){
      todo.subtasks.push({
        subtask: req.body.subtask,
        done: false
      });
    }

    // Save the todo and check for errors
    todo.save(function(err) {
      if (err)
        res.send(err);

      console.log(todo);

      res.json(todo);
    });
  });
});

var subtaskRoute = router.route('/todos/:todo_id/subtask/:subtask_id');

subtaskRoute.put(function(req, res) {
  console.log(req.body);
  // Create a new instance of the Todo model
  Todo.findById(req.params.todo_id, function(err, todo) {
    if (err)
      res.send(err);

    var subtaskPlace = 0;
    todo.subtasks.forEach(function(subtask, i){
      if(subtask._id == req.params.subtask_id){
        subtaskPlace = i;
      }
    })
    console.log(subtaskPlace);
    //todo.subtasks.splice(subtaskPlace, 1);
    todo.subtasks[subtaskPlace] = {subtask: req.body.subtask, done: req.body.done}; 

    // Save the todo and check for errors
    todo.save(function(err) {
      if (err)
        res.send(err);

      //console.log(todo);

      res.json(todo);
    });
  });
});

subtaskRoute.delete(function(req, res) {
  console.log(req.body);
  // Create a new instance of the Todo model
  Todo.findById(req.params.todo_id, function(err, todo) {
    if (err)
      res.send(err);

    var subtaskPlace = -1;
    todo.subtasks.forEach(function(subtask, i){
      if(subtask._id == req.params.subtask_id){
        subtaskPlace = i;
      }
    })
    if(subtaskPlace > -1) {
      todo.subtasks.splice(subtaskPlace, 1);
       todo.save(function(err) {
        if (err)
          res.send(err);

        console.log(todo);

        res.json(todo);
      });
    } else {
      res.send("No subtask with this id");
    }
    //todo.subtasks[subtaskPlace] = {subtask: req.body.subtask}; 

    // Save the todo and check for errors
   
  });
});


// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(port);
console.log('Insert todo on port ' + port);