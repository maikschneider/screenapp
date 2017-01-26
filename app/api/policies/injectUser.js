module.exports = function(req, res, next) {

  var user = req.session.me;

  req.body['user'] = user;

  return next();

}
