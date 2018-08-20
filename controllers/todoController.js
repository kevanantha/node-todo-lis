const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://test:password1@ds125932.mlab.com:25932/app-todo');

// create a schema, like a blueprint
const todoSchema = new mongoose.Schema({
  item: String
});

// create module
const Todo = mongoose.model('Todo', todoSchema);

// let data = [
//   {
//     item: 'get milk'
//   },
//   {
//     item: 'walk the dog'
//   },
//   {
//     item: 'kicking some coding ass'
//   }
// ];

const urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = (app) => {

  app.get('/todo', (req, res) => {
    // get data from mongodb and pass it to the view
    Todo.find({}, (err, data) => {
      if (err) throw err;
      res.render('todo', { todos: data });
    });
  });

  app.post('/todo', urlencodedParser, (req, res) => {
    // get data from the view and add it to mongodb
    const newTodo = Todo(req.body).save((err, data) => {
      if (err) throw err;
      res.json(data);
    });
  });

  app.delete('/todo/:item', (req, res) => {
    // delete the requested item from mongodb
    Todo.find({item: req.params.item.replace(/\-/g, " ")})
    .remove((err, data) => {
      if (err) throw err;
      res.json(data);
    });
  });

};