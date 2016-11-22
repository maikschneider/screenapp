/**
 * ScreenController
 *
 * @description :: Server-side logic for managing Screens
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  play: function(req, res) {

    var id = req.param('id',null);

    Screen.findOne(id).exec(function(err, screen){
      res.view('screen/play', {layout: false, 'screen':screen});
    });

  },

  /**
   * See http://sailsjs.org/documentation/concepts/realtime
   */
  live: function(req, res) {

    if (!req.isSocket) {return res.badRequest();}

    var id = req.param('id',null);

    Screen.findOne(id).exec(function(err, screen){

      Playlist.findOne(screen.list).populate('items').exec(function(err, playlist){

        sails.sockets.join(req, 'playlistsocket'+playlist.id);

        //sails.sockets.broadcast(screenSocketName, 'hello', {id: 'my id'}, req);
        BroadcastService.start(playlist);

        return res.ok({
            message: "OK"
        });

      });
    });

  }

};

