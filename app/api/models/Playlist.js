/**
 * Playlist.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'text',
      required: true
    },
    live: {
      type: 'boolean',
      defaultsTo: false
    },

    screens: {
      collection: 'screen',
      via: 'list'
    },
    items: {
      collection: 'playlistitem',
      via: 'playlist'
    }
  }
};

