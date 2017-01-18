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
      enum: ['weather', 'twitter', 'msg', 'dvb']
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
    // DVB settings
    dvbStop: 'text',


    playlist: {
      model: 'playlist',
    },

    getIcon: function() {
      var htmlclass = "";
      switch(this.appType) {
        case 'weather':
          htmlclass = 'sun-o';
          break;
        case 'msg':
          htmlclass = 'comment';
          break;
        case 'dvb':
          htmlclass = 'bus';
          break;
        default:
          htmlclass = this.appType;
      }
      return '<i class="fa fa-' + htmlclass + '"></i>';
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
    // only update api data if id available (when added to playlist oder other fields become changed)
    if(_.isUndefined(values.id)){
      next();
    } else{
      AppService.runBeforeUpdate(values, next);
    }
  },
  beforeCreate: function(values, next){
    AppService.runBeforeCreate(values, next);
  },
  afterUpdate: function(values, next){
    AppService.publishUpdate(values, next);
  }

};

