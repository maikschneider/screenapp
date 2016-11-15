/**
 * ScreenController
 *
 * @description :: Server-side logic for managing Screens
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function(req, res) {

    Screen.find().exec(function(err, screens){
      Playlist.find().exec(function(err, lists){
        PlaylistItem.find().exec(function(err, items){

          res.view('screen/index', {'data': [screens, lists, items]});

        });
      });

    });


  }
};

