/**
 * ScreenController
 *
 * @description :: Server-side logic for managing Screens
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  play: function(req, res) {

    var id = req.param('id',null);

    Screen.findOne(id).then(function(screen){

      // set playlist live
      Playlist.update(screen.list, {live:true}).exec(function(err, playlist){

        Playlist.findOne(playlist[0].id).populate('items').then(function(p){
          BroadcastService.initPlaylist(p);
          if (req.wantsJSON) {
            return res.send(200);
          }
          return res.view('screen/play', {
            layout: false,
            'screen': screen,
            'playlist': p,
            'activeItem': BroadcastService._getActiveItem(p),
            'activeTweet': BroadcastService._getActiveTweet(p)
          });
        });

      });

    }).catch(function(err){
      // @todo implement error message
    });

  },

  stop: function(req, res) {

    var id = req.param('id',null);

    Screen.findOne({id: id, user: req.session.me}).then(function(screen){
      Playlist.update(screen.list, {live:false}).exec(function(err, playlist){
        BroadcastService.stopPlaylist(playlist[0]);
        if (req.wantsJSON) {
          return res.send(200);
        }
        return res.redirect('/');
      });
    }).catch(function(err){
      if (req.wantsJSON) {
        return res.send(404);
      }
      return res.notFound();
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

        return res.ok({
            playlist: playlist
        });

      });
    });

  }

};

