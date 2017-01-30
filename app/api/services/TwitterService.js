'use strict';

const BaseAppService = require("./BaseAppService");

module.exports = class TwitterService extends BaseAppService {

  constructor(){
    super();
    this.consumer_key = 'pixRh7PZGXNdSeVsFAXAZ9Bag';
    this.consumer_secret = 'RucPX4H4lrPiDGydAlyJWGFOH16GI3Bi0pgy2hnfUHE7JFe4l7';
    this.bearer_token = undefined;
  }

  obtainBearerToken(callback){
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
  }

  getData(callback) {
    var _this = this;

    if(_.isUndefined(this.bearer_token)) {
      this.obtainBearerToken(function(){
        _this.getData(callback);
      });
    }
    else{
      this.obtainTwitterData(callback);
    }

  }

  obtainTwitterData(callback) {
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
  }

}
