module.exports = {

  index: function(req, res) {

    Screen.find().populate('list').exec(function(err, screens){
      Playlist.find().exec(function(err, lists){
        PlaylistItem.find().exec(function(err, items){
          res.view('admin/index', {'screens': screens, 'lists': lists, 'items': items});
        });
      });
    });

  },

  screen: function(req, res) {

    Playlist.find().exec(function(err, lists){
      res.view('admin/screen', {'lists':lists});
    });

  },

  playlist: function(req, res) {
    var id = req.param('id', false);
    var filter = id ? {list: id} : {};
    Screen.find().where(filter).exec(function(err, screens){
      PlaylistItem.find().exec(function(err, items){
          res.view('admin/playlist', {'screens': screens, 'items': items, 'playlist': id});
      });
    });

  },

  playlistitem: function(req, res) {
    var id = req.param('id', false);
    Playlist.find().exec(function(err, lists){
        res.view('admin/playlistitem', {'lists': lists, 'item': id});
    });

  },

  geocode: function(req, res) {
    if (!req.isSocket) {return res.badRequest();}
    var location = req.param('location', false);
    GeocodeService.getCoordinatesByLocationName(location, function(data){
      return res.ok({
          message: data
      });
    });
  }

}
