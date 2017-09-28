var {User} = require('./../models/user');

// MIDDLEWARE for making routes private
var authenticate = (req, res, next) => {
   var token = req.header('x-auth');
   User.findByToken(token).then((user) => {
      if (!user) {
         return Promise.reject();
      }
      // We are sending back modified request file that includes the user/token info
      req.user = user;
      req.token = token;
      next();
   }).catch((e) => {
      res.status(401).send(e);
   });
};


module.exports = {authenticate};
