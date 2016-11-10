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

    // Weather settings
    weatherLocation: 'text',
    weatherUnit: 'boolean',
    weatherFontColor: 'text',
    weatherBackgroundImage: 'text',
    // Twiiter settings
    twitterFilter: 'text',
    twitterTweetDuration: 'integer',
    twitterShowRetweets: 'boolean',
    // Message settings
    msgHeadline: 'text',
    msgText: 'text',
    msgImage: 'text',


    playlist: {
      model: 'playlist',
    },

  }
};

