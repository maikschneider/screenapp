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
        _this.runService(playlist.items[index]);

        var newIndex = ((index + 1) < playlist.items.length) ? index+1 : 0;
        _this.loopPlaylist(playlist, newIndex);
      }, 5000);

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
          WeatherService.run(playlistitem);
          break;
        default:
          //@todo return something
      }
    },




}
