exports.isUser = function (req, res, next) {
  if (req.isAuthenticated()) {
      return next()
  } else {
      // req.flash('error', 'you have to login first')
      // res.send('login first')
      res.redirect('/admin/login')
  }
}