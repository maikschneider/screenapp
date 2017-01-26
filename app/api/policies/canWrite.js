var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

module.exports = function(req, res, next) {

  var user = req.session.me;
  var Model = actionUtil.parseModel(req);

  Model.findOne(req.param('id')).exec(function(err,foundModel){
    if(err) throw err;

    if(foundModel.user==user)
      return next();

    // No access
    if (req.wantsJSON) {
      return res.send(401);
    }
    return res.forbidden();

  });

}
