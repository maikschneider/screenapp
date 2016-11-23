module.exports = {

    playlist: null,

    start: function(playlist) {

      // abort if no playlist or no playlist items / empty items
      if(!playlist || typeof(playlist.items) === 'undefined' || playlist.items.length == 0) return false;

      this.playlist = playlist;

      this.loopPlaylist(playlist, 0);


    },

    loopPlaylist: function(playlist, index) {

      var _this = this;

      setTimeout(function(){

        if(!_this.checkStatus(playlist)) return false;

        _this.runService(playlist.items[index]);

        var newIndex = ((index + 1) < playlist.items.length) ? index+1 : 0;
        _this.loopPlaylist(playlist, newIndex);

      }, 5000);

    },

    checkStatus: function(playlist) {
      var status = true;
      // check if playlist has active subscribers
      // caution: not working in multi-server enviorment: http://sailsjs.com/documentation/reference/web-sockets/sails-sockets/sails-sockets-subscribers
      sails.sockets.subscribers('playlistsocket'+playlist.id, function(err, socketIds){
        if(!socketIds.length) status = false;
      });

      // cancel if playlist was stopped
      status = playlist.live;

      return status;
    },

    runService: function(playlistitem) {

      switch(playlistitem.appType) {

        case 'msg':
          MsgService.run(playlistitem);
          break;
        case 'twitter':
          TwitterService.run(playlistitem);
          break;
        case 'weather':
          WeatherService.init(playlistitem.id);
          break;
        default:
          //@todo return something
      }
    },




}
