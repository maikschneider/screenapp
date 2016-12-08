module.exports = {

  consumer_key: 'pixRh7PZGXNdSeVsFAXAZ9Bag',
  consumer_secret: 'RucPX4H4lrPiDGydAlyJWGFOH16GI3Bi0pgy2hnfUHE7JFe4l7',
  bearer_token: undefined,
  data: null,
  playlistitem: null,

  runAndSave: function(playlistitemId) {
    sails.log.info('TwitterService runAndSave('+playlistitemId+')');
    this.init(playlistitemId, this.updatePlaylistitem);
  },

  runBeforeUpdate: function(values, callback) {
    sails.log.info('TwitterService: runBeforeUpdate('+values.id+')');
    var _this = this;

    // get old item from database
    this.init(values.id, function(){
      // if location changed or cachetime is over
      if(values.twitterFilter != _this.playlistitem.twitterFilter || _this.needDataUpdate()){
        // set to new location
        _this.playlistitem.twitterFilter = values.twitterFilter;

        _this.getTwitterData(function(){
          values.data = _this.data;
          callback();
        });
      } else {
        callback();
      }
    });

  },

  runBeforeCreate: function(values, callback) {
    sails.log.info('TwitterService: runBeforeCreate()');
    var _this = this;

    this.playlistitem = values;

    _this.getTwitterData(function(){
      values.data = _this.data;
      callback();
    });
  },

  updatePlaylistitem: function() {
    if(this.needDataUpdate()){
      var callback = this.saveTwitterData;
      this.getTwitterData(callback);
    } else {

    }
  },

  init: function(playlistitemId, callback) {
    var _this = this;

    PlaylistItem.findOne(playlistitemId).then(function(playlistitem){
      _this.playlistitem = playlistitem;

      callback();
    }).catch(function(err){
      sails.log.warn('No PlaylistItem with ID ' + playlistitemId + ' was found.');
      sails.log.warn(err);
    });
  },

  needDataUpdate: function() {
    // @Todo create cache function
    return true;
  },

  obtainBearerToken: function(callback){
    var _this = this;
    var bearer_token_credentials = encodeURI(this.consumer_key) + ':' + encodeURI(this.consumer_secret);
    var base64url = require('base64-url');
    bearer_token_credentials = base64url.encode(bearer_token_credentials);

    var request = require('request');
    var options  = {
      baseUrl : 'https://api.twitter.com/',
      uri : 'oauth2/token',
      method : 'POST',
      headers: {
          'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8',
          'Authorization' : 'Basic ' + bearer_token_credentials
      },
      body: 'grant_type=client_credentials'
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var res = JSON.parse(body);
          _this.bearer_token = res.access_token;
        } else {
          sails.log.warn(error);
          sails.log.warn(response);
          sails.log.warn(body);
        }
        callback();
    });
  },

  getTwitterData: function(callback) {
    var _this = this;

    if(_.isUndefined(this.bearer_token)) {
      this.obtainBearerToken(function(){
        _this.getTwitterData(callback);
      });
    }
    else{
      this.obtainTwitterData(callback);
    }

  },

  obtainTwitterData: function(callback) {
    var _this = this;

    var request = require('request');
    var options  = {
      baseUrl : 'https://api.twitter.com/',
      uri : '1.1/search/tweets.json?q=' + encodeURIComponent( _this.playlistitem.twitterFilter ),
      method : 'GET',
      auth : {
        'bearer' : _this.bearer_token
      }
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          _this.data = JSON.parse(body);;
        } else {
          sails.log.warn(error);
          sails.log.warn(response);
          sails.log.warn(body);
        }
        callback();
    });
  },

  saveTwitterData: function() {
    var _this = this;
    // Update Item
    PlaylistItem.update({id: this.playlistitem.id}).set({data: _this.data}).exec(function(err, updatedPlaylistitems){
      if(err){
        console.log(err);
      }
    });
  },

  publishUpdate: function(playlistitem, callback) {
    sails.hooks.views.render('screen/twitter', {layout: false, item: playlistitem, activeTweet:0}, function(err,html){
      if(err) sails.log.warn(err);
      sails.sockets.broadcast('playlistsocket'+playlistitem.playlist, 'itemUpdate', {'item': playlistitem, 'html': html});
      if(callback) callback();
    });

  }

}
