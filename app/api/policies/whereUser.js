module.exports = function(req, res, next) {

  var user = req.session.me;

  if(!req.options.where) req.options.where = {};
  req.options.where.user = req.session.userId;

  return next();

}
