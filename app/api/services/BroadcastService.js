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

        case 'twitter':
          TwitterService.runAndSave(playlistitem.id);
          break;
        case 'weather':
          WeatherService.runAndSave(playlistitem.id);
          break;
        default:
          //@todo return something
      }
    },

    startPlaylistCron: function() {
      if(this.isStarted) return false;

      sails.log.info('Starting Cron');

      var _this = this;
      var schedule = require('node-schedule');

      var j = schedule.scheduleJob('*/5 * * * * *', function(){
        _this.tick();
      });

      this.isStarted = true;
    },

    startTwitterCron: function(playlist) {
        sails.log.info('Starting Twitter Cron');

        var _this = this;
        var schedule = require('node-schedule');

        var activeItemOffset = this._getActiveItem(playlist);
        var seconds = playlist.items[activeItemOffset].twitterTweetDuration;

        var startTime = new Date(Date.now());
        var endTime = new Date(startTime.getTime() + (playlist.items[activeItemOffset].duration * 1000));

        var j = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/'+seconds+' * * * * *' }, function(){
          sails.log.info('BroadcastsService: TweetChange');
          sails.sockets.broadcast('playlistsocket'+playlist.id, 'tweetChange', {});
        });
    },

    /**
     * Called from cron job
     */
    tick: function() {

      _this = this;

      sails.log.info(this.onAir);

      _.each(this.onAir, function(playlistData, playlistID){
        _this.onAir[playlistID].timeLeft -= 5;
        if(_this.onAir[playlistID].timeLeft <= 0) _this.triggerSlideChange(playlistID);
      });

    },

    triggerSlideChange: function(playlistID) {
      sails.log.info('BroadcastsService:triggerSlideChange()');
      var _this = this;
      Playlist.findOne(playlistID).populate('items').then(function(playlist){

        // check Playlist for items
        if(_this.validatePlaylistItems(playlist)) return false;

        // broadcast slidechange to playlist room
        sails.sockets.broadcast('playlistsocket'+playlist.id, 'slideChange', {item: _this.onAir[playlistID].nextItem});

        // start twitter cron job if necessary
        if(playlist.items[_this.onAir[playlistID].nextItem].appType == 'twitter') _this.startTwitterCron(playlist);

        _this.afterSlideChange(playlist);

      }).catch(function(err){
        sails.log.warn(err);
      });

    },

    /**
     * Set next item, trigger Service API
     * @param  {Playlidt} playlist
     */
    afterSlideChange: function(playlist) {

        // set next item and duration
        this.onAir[playlist.id].timeLeft = playlist.items[this.onAir[playlist.id].nextItem].duration;
        var nextItem = this.onAir[playlist.id].nextItem + 1;
        this.onAir[playlist.id].nextItem = playlist.items.length == nextItem ? 0 : nextItem;

        // run API for next item
        var nextItemOffset = this.onAir[playlist.id].nextItem;
        this.runService(playlist.items[nextItemOffset]);

    },

    initPlaylist: function(playlist) {

      if(this._isOnAir(playlist)){
        sails.log.info('Playlist ' + playlist.id + ' already in broadcast queue.');
        return false;
      }

      if(this.validatePlaylistItems(playlist)) return false;

      this.onAir[playlist.id] = {
        timeLeft: playlist.items[0].duration,
        nextItem: (playlist.items.length > 1) ? 1 : 0,
      };

      // start twitter cron if first item is twitter item
      if(playlist.items[0].appType == 'twitter') this.startTwitterCron(playlist);

      this.startPlaylistCron();

      sails.log.info('BroadcastsService: init Playlist ' + playlist.id);
    },

    /**
     * If Playlist has no Items, it becomes removed
     * @param  {Playlist} playlist
     * @return {Boolean}
     */
    validatePlaylistItems: function(playlist) {
      if(_.isUndefined(playlist.items) || playlist.items.length<1){
        sails.log.info('Playlist '+ playlist.id +' has no items');
        this.stopPlaylist(playlist);
        return true;
      }
      return false;
    },

    _isOnAir: function(playlist) {
      return _.isUndefined(this.onAir[playlist.id]) ? false : true;
    },

    stopPlaylist: function(playlist) {
      if(!this._isOnAir(playlist)) return false;
      delete this.onAir[playlist.id];
    },

    _getActiveItem(playlist) {
      if(!this._isOnAir(playlist)) return 0;
      if(_.isUndefined(playlist.items) || playlist.items.length<=1) return 0;

      var activeItem = this.onAir[playlist.id].nextItem - 1;
      activeItem == -1 ? playlist.items.length - 1 : activeItem;

      return activeItem;
    },




}
