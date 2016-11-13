/**
 * ScreenController
 *
 * @description :: Server-side logic for managing Screens
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function(req, res) {
    res.view('screen/index')
  }
};

