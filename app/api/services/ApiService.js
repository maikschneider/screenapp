'use strict';

const BaseAppService = require("./BaseAppService");
const MsgService = require("./MsgService");
const TwitterService = require("./TwitterService");
const DvbService = require("./DvbService");
const WeatherService = require("./WeatherService");

var s = require("underscore.string");

module.exports = {

  getService(playlistAppType){
    switch(playlistAppType){
      case 'msg':
        var service = new MsgService();
        break;
      case 'twitter':
        var service = new TwitterService();
        break;
      case 'dvb':
        var service = new DvbService();
        break;
      case 'weather':
        var service = new WeatherService();
        break;
      default:
        var service = new BaseAppService();
        sails.log.warn('ApiService: No concrete ApiService found.');
      }
    return service;
  },

  runUpdate: function(playlistitemId, playlistAppType) {
    var service = this.getService(playlistAppType);
    service.runUpdate(playlistitemId);
  },

  runBeforeUpdate: function(values, callback){
    var service = this.getService(values.appType);
    service.runBeforeUpdate(values, callback);
  },

  runBeforeCreate: function(values, callback){
    var service = this.getService(values.appType);
    service.runBeforeCreate(values, callback);
  },

  publishUpdate: function(values, callback){
    var service = this.getService(values.appType);
    service.publishUpdate(values, callback);
  }



}
