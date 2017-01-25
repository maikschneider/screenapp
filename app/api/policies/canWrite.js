var actionUtil = require('../../node_modules/sails/lib/hooks/blueprints/actionUtil');

module.exports = function(req, res, next) {

  var user = req.session.me;
  var Model = actionUtil.parseModel(req);

  Model.findOne({user:user}).exec(function(err,foundModel){
    if(err) throw err;

    if(req.param('id')==foundModel.id)
      return next();

    // No access
    if (req.wantsJSON) {
      return res.send(401);
    }
    return res.forbidden();

  });

}
