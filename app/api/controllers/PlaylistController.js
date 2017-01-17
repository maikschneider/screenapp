/**
 * PlaylistController
 *
 * @description :: Server-side logic for managing Playlists
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

   items: function(req, res) {

    if (!req.isSocket) {
      return res.badRequest('Only a socket request can subscribe to this action');
    }

    var id = req.param('id',null);

    // find all playlistitems on the given list
    PlaylistItem.find({playlist: id}).exec(function(err, playlistitems){
      if (err) {
        return res.serverError(err);
      }
      // subscribe to these playlistitems
      console.log(_.pluck(playlistitems, 'id'));
      PlaylistItem.subscribe(req, _.pluck(playlistitems, 'id'));

      return res.ok();
    });

   },

   /**
    * See http://sailsjs.org/documentation/concepts/realtime
    */
   live: function(req, res) {

     if (!req.isSocket) {return res.badRequest();}

     var id = req.param('id',null);

     Playlist.findOne(id).exec(function(err, playlist){

         sails.sockets.join(req, 'playlistsocket'+playlist.id);

         return res.ok({
             playlist: playlist
         });

     });

   }

};

