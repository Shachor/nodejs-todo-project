// const {server, app} = require('./../server')

const request = require('supertest');   // MAKE SURE TO NAME IT REQUEST
const expect = require('expect');


// ADDING DEPENDENCIES
const {app} = require('./../server');
const {Todo} = require('./../models/todo');


// CREATE DUMMY DATA TO FILL DATABASE
const todos = [{
  text: "First test item"
}, {
  text: "Second test item"
}];

// REMOVE ENTRIES FROM DB BEFORE TESTING
// This will run BEFORE EVERY test case
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

// DESCRIBE for POST routes
describe('POST /todos', () => {
  // CREATE A NEW todo
  it('should create a new todo', (done) => {
    var text = 'This is a test todo';

    // SUPERTEST request method. Chain on expect statements
    request(app)
      .post('/todos')
      .send({text})   // Here we send data to the body with request
      .expect(200)    // Expect a good status to return
      .expect((res) => {       // Make sure body comes back with correct text string
        expect(res.body.text).toBe(text); // We chain in an expect statement to check contents
      })
      // Instead of passing done, we want to check mongo to make sure todo was added
      .end((err, response) => {
        if (err) {
          return done(err);   // return an error, otherwise...
        }
        // This section will test the database to make sure todo was added correctly
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);   // Length should be 1 since we just added it
          expect(todos[0].text).toBe(text);   // text should be same as var above
          done();
        }).catch((e) => {   // if error, we catch it here
          done(e);
        });
      });
  });

  // MAKE SURE IT DOES NOT CREATE todo WITH INCORRECT DATA
  it('should not create todo with invalid body data', (done) => {
    // We will pass in NOTHING at all
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, result) => {
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

// DESCRIBE for GET /todos routes
describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});
