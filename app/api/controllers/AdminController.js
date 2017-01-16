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

    Screen.find().exec(function(err, screens){
      PlaylistItem.find().exec(function(err, items){
          res.view('admin/playlist', {'data': [screens, items]});
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
          if(!err) res.view('homepage', {layout: false, emailsend: true});
        }
      );
    }
    else {
      res.view('homepage', {layout: false});
    }
  }

}
