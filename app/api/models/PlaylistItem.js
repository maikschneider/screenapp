/**
 * PlaylistItem.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'text',
      required: true,
    },
    duration: {
      type: 'integer',
      defaultsTo: 30,
    },
    appType: {
      type: 'string',
      enum: ['weather', 'twitter', 'msg']
    },
    data: {
      type: 'json',
      defaultsTo: [],
    },

    // Weather settings
    weatherLocation: 'text',
    weatherLocationCode: {
      type: 'text',
      defaultsTo: false
    },
    weatherUnit: {
      type: 'boolean',
      defaultsTo: true
    },
    weatherFontColor: 'text',
    weatherBackgroundImage: 'text',
    // Twiiter settings
    twitterFilter: 'text',
    twitterTweetDuration: {
      type: 'integer',
      defaultsTo: 5
    },
    twitterShowRetweets: {
      type: 'boolean',
      defaultsTo: false
    },
    // Message settings
    msgHeadline: 'text',
    msgText: 'text',
    msgImage: 'text',


    playlist: {
      model: 'playlist',
    },
  },

  geocode: function(location, cb) {

    var geoData = GeocodeService.getCoordinatesByLocationName(location, cb);

  },

  // Lifecycle Callbacks
  // see: https://github.com/balderdashy/waterline-docs/blob/master/models/lifecycle-callbacks.md
  beforeValidate: function(values, next) {
    values.twitterShowRetweets = (values.twitterShowRetweets=='on' || values.twitterShowRetweets === true) ? true: false;
    next();
  },
  beforeUpdate: function(values, next){
    switch(values.appType) {
      case 'twitter':
        TwitterService.runBeforeUpdate(values, next);
        break;
      case 'weather':
        WeatherService.runBeforeUpdate(values, next);
        break;
      default:
        next();
    }
  },
  beforeCreate: function(values, next){
    switch(values.appType) {
      case 'twitter':
        TwitterService.runBeforeCreate(values, next);
        break;
      case 'weather':
        WeatherService.runBeforeCreate(values, next);
        break;
      default:
        next();
    }
  },
  afterUpdate: function(values, next){
    switch(values.appType) {
      case 'twitter':
        TwitterService.publishUpdate(values, next);
        break;
      case 'weather':
        WeatherService.publishUpdate(values, next);
        break;
      default:
        next();
    }
  }

};

