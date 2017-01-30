module.exports = {

  index: function(req, res) {

    Screen.find({user: req.session.me}).populate('list').exec(function(err, screens){
      Playlist.find({user: req.session.me}).populate('items').populate('screens').exec(function(err, lists){
        PlaylistItem.find({user: req.session.me}).exec(function(err, items){
          res.view('admin/index', {'screens': screens, 'lists': lists, 'items': items});
        });
      });
    });

  },

  screens: function(req, res) {
    Screen.find({user: req.session.me}).populate('list').exec(function(err, screens){
      res.view('admin/screens', {'screens': screens});
    });
  },

  screen: function(req, res) {
    var id = req.param('id', false);
    Playlist.find({user: req.session.me}).exec(function(err, lists){
      res.view('admin/screen', {'lists':lists, 'screen': id});
    });

  },

  playlists: function(req, res) {
    Playlist.find({user: req.session.me}).populate('items').populate('screens').exec(function(err, lists){
      res.view('admin/playlists', {'lists': lists});
    });
  },

  playlist: function(req, res) {
    var id = req.param('id', false);
    Screen.find({user: req.session.me}).exec(function(err, screens){
      PlaylistItem.find({user: req.session.me}).exec(function(err, items){
          res.view('admin/playlist', {'screens': screens, 'items': items, 'playlist': id});
      });
    });

  },

  playlistitems: function(req, res) {
    PlaylistItem.find({user: req.session.me}).exec(function(err, items){
      res.view('admin/playlistitems', {'items': items});
    });
  },

  playlistitem: function(req, res) {
    var id = req.param('id', false);
    Playlist.find({user: req.session.me}).exec(function(err, lists){
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
  },

  contact: function(req, res) {
    var name = req.param('name');
    var email = req.param('email');
    var message = req.param('message');

    if(req.method=='POST' && name.length && email.length && message.length){

      sails.hooks.email.send(
        "contact",
        {
          recipientName: name,
          recipientEmail: email,
          recipientMessage: message,
        },
        {
          to: "m.schneider@blueways.de",
          from: "infomonitorapp@gmail.com",
          subject: "Kontaktanfrage von InfoMonitor"
        },
        function(err) {
          console.log(err || "Email send!");
          if(!err) res.view('homepage/default', {layout: 'frontend', emailsend: true});
        }
      );
    }
    else {
      return res.redirect('/');
    }
  }

}
