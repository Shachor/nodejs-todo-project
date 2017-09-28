// ADDING MODULE DEPENDENCIES
const request = require('supertest');   // MAKE SURE TO NAME IT REQUEST
const expect = require('expect');
const {ObjectID} = require('mongodb');


// ADDING OBJECT DEPENDENCIES
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');



// REMOVE ENTRIES FROM DB BEFORE TESTING
// This will run BEFORE EVERY test case
beforeEach(populateUsers);
beforeEach(populateTodos);




// ==========================================================================
// DESCRIBE for POST routes
// ==========================================================================
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

// ==========================================================================




// ==========================================================================
// DESCRIBE for GET /todos routes
// ==========================================================================
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

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      //We need to grab the _id property for the first todo. That's why we
      //declare the ObjectID in the todo declaration above. Here we need to
      //convert it to a string using .toHexString so we can pass it to request
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return a 404 if todo not found', (done) => {
    //make req with real ObjectID, just not one in collection
    var id = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
    // make sure you get 404 back
  });

  it('should return 404 for non-ObjectIDs', (done) => {
    // send in /todos/123
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});

// ==========================================================================



// ==========================================================================
// DESCRIBE for DELETE /todos/:id routes
// ==========================================================================
describe('DELETE /todos/:id', () => {
  it('should delete todo by id', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      // .end(done());
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        //query db with findById and make sure it doesn't exist (toNotExist)
        Todo.findById(res.hexId).then((result) => {
          expect(result).toEqual(null);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return a 404 if todo not found', (done) => {
    //make req with real ObjectID, just not one in collection
    var id = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
    // make sure you get 404 back
  });

  it('should return 404 for non-ObjectIDs', (done) => {
    // send in /todos/123
    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done);
  });
});
// ==========================================================================



// ==========================================================================
// DESCRIBE for PATCH /todos/:id routes
// ==========================================================================
describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    //grab id of first item
    var hexId = todos[0]._id.toHexString();
    var updatedTodo = {text: 'I am soooo tired', completed: true};
    //make patch request
    request(app)
      .patch(`/todos/${hexId}`)
      .send(updatedTodo)
      //update text
      //set completed to true
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(updatedTodo.text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
        //make sure you get 200
        // custom asertion - text is changed, completed true, completedAt is number .toBeA(number)

  });

  it('should clear completedAt when todo is not completed', (done) => {
    //grab id of second todo
    var hexId = todos[1]._id.toHexString();
    var updatedTodo = {text: 'I am still soooo tired', completed: false};
    //make patch request
    request(app)
      .patch(`/todos/${hexId}`)
      .send(updatedTodo)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(updatedTodo.text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
    //update text, set compelted to false
      //assert 200
      //assert response.body is now text and completed is now false, completedAt is null .toNotExist
  });
});
// ==========================================================================



// ==========================================================================
// DESCRIBE for GET /users/me route
// ==========================================================================
describe('GET /users/me', () => {
   it('should return user if authenticated', (done) => {
      request(app)
         .get('/users/me')
         .set('x-auth', users[0].tokens[0].token)
         .expect(200)
         .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
         })
         .end(done);
   });

   it('should return a 401 if not authenticated', (done) => {
      request(app)
         .get('/users/me')
         .expect(401)
         .expect((res) => {
            expect(res.body).toEqual({});
         })
         .end(done);
   });
});
// ==========================================================================



// ==========================================================================
// DESCRIBE for POST /users route
// ==========================================================================
describe('POST /users', () => {
   it('should create a user', (done) => {
      var email = 'someEmail@test.com';
      var password = 'password1';

      request(app)
         .post('/users')
         .send({email, password})
         .expect(200)
         .expect((res) => {
            expect(res.headers['x-auth']).toExist();     // Use [] because x-auth has hypen in it
            expect(res.body._id).toExist();
            expect(res.body.email).toExist(email);
         })
         .end((err) => {
            if (err) {
               return done(err);
            }
            // Instead of just ending, we're calling the user back from the db
            // and making expect assumptions about it.
            User.findOne({email}).then((user) => {
               expect(user).toExist();
               expect(user.password).toNotBe(password);   // password should be hashed
               done();
            }).catch((e) => done(e));
         });
   });

   it('should return validation errors if request invalid', (done) => {
      var email = 'someEmail@@test.com';
      var password = 'pass';

      request(app)
         .post('/users')
         .send({email, password})
         .expect(400)
         .end(done);
   });

   it('should not create user if email is in use', (done) => {
      var email = 'tester1@test.com';
      var password = 'password1';

      request(app)
         .post('/users')
         .send({email, password})
         .expect(400)
         .end(done);
   });
});
// ==========================================================================



// ==========================================================================
// DESCRIBE for POST /users/login route
// ==========================================================================
describe('POST /users/login', () => {
   it('should login user and return auth token', (done) => {
      request(app)
         .post('/users/login')
         .send({email: users[1].email, password: users[1].password})
         .expect(200)
         .expect((res) => {
            expect(res.header['x-auth']).toExist();
         })
         .end((err, res) => {
            if (err) {
               return done(err);
            }
            User.findById(users[1]._id).then((user) => {
               expect(user.tokens[0]).toInclude({
                  access: 'auth',
                  token: res.headers['x-auth']
               });
            done();
         }).catch((e) => done(e));
      });
   });

   it('should reject invalid login', (done) => {
      request(app)
         .post('/users/login')
         .send({email: users[1].email, password: 'InvalidPass'})
         .expect(400)
         .expect((res) => {
            expect(res.header['x-auth']).toNotExist();
         })
         .end((err, res) => {
            if (err) {
               return done(err);
            }
            User.findById(users[1]._id).then((user) => {
               // expect(user.tokens[0] === []);
               expect(user.tokens.length).toBe(0);
               done();
            }).catch((e) => done(e));
         });
   });
});

// ==========================================================================



// ==========================================================================
// DESCRIBE for DELETE /users/me/token route
// ==========================================================================
describe(' DELETE /users/me/token', () => {
   it('should delete the token from db when called', (done) => {
      request(app)
         .delete('/users/me/token')
         .set('x-auth', users[0].tokens[0].token)
         .expect(200)
         .expect((res) => {
            expect(res.header['x-auth']).toNotExist();
         })
         .end((err, res) => {
            if (err) {
               return done(err);
            }
            User.findById(users[0]._id).then((user) => {
               expect(user.tokens.length).toBe(0);
               done();
            }).catch((e) => done(e));
         });
   });
});





// ==========================================================================
