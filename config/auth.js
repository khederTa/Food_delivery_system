module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');      
  },
  authenticateToken: function(req, res, next){
    const jwt = require('jsonwebtoken')
    const authHeader = req.headers['authorization']
    const token = authHeader & authHeader.split(' ')[1]
    if(token == null)return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, usr)=>{
      if(err){
        console.log(`err = ${err}`)
        return res.sendStatus(403);}
      req.body = usr;
      next()
    })
    
  }
};


