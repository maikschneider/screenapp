module.exports = {

    isStarted: false,
    onAir: {
      /*
      playlistID11: {
        timeLeft: 30,     // playlistitem duration that gets decreased
        nextItem: 0       // offset of the next playlistitem
      }
      */
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

    startCron: function() {
      if(this.isStarted) return false;

      sails.log.info('Starting Cron');

      var _this = this;
      var schedule = require('node-schedule');

      var j = schedule.scheduleJob('*/5 * * * * *', function(){
        _this.tick();
      });

      this.isStarted = true;
    },

    /**
     * Called from cron job
     */
    tick: function() {
      sails.log.info(this.onAir);
    },

    initPlaylist: function(playlist) {

      sails.log.info(this.onAir);

      if(this._isOnAir(playlist)){
        sails.log.info('Playlist ' + playlist.id + ' already in broadcast queue.');
        return false;
      }

      if(_.isUndefined(playlist.items) || playlist.items.length<1){
        sails.log.info('Playlist '+ playlist.id +' has no items');
        return false;
      }

      this.onAir[playlist.id] = {
        timeLeft: playlist.items[0].duration,
        nextItem: (playlist.items.length > 1) ? 1 : 0,
      };

      if(!this.isStarted) this.startCron();

      sails.log.info('BroadcastsService: Added Playlist ' + playlist.id);
    },

    _isOnAir: function(playlist) {
      return (_.findKey(this.onAir, playlist.id) === undefined) ? false : true;
    },

    stopPlaylist: function(playlist) {

      if(!this._isOnAir(playlist)) return false;

      delete this.onAir[playlist.id];

    }




}
