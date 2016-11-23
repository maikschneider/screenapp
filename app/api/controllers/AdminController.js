module.exports = {

  index: function(req, res) {

    Screen.find().populate('list').exec(function(err, screens){
      Playlist.find().exec(function(err, lists){
        PlaylistItem.find().exec(function(err, items){
          res.view('admin/index', {'data': [screens, lists, items]});
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

    Screen.find().exec(function(err, screens){
      PlaylistItem.find().exec(function(err, items){
          res.view('admin/playlist', {'data': [screens, items]});
      });
    });

  },

  playlistitem: function(req, res) {

    Playlist.find().exec(function(err, lists){
        res.view('admin/playlistitem', {'lists': lists});
    });

  }

}
