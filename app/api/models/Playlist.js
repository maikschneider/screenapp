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
    },
    user: {
      model: 'user'
    },

    toJSON: function () {
      var obj = this.toObject();
      delete obj.user;
      return obj;
    },

    getDuration: function(){
      var duration = 0;
      _.each(this.items, function(item){
        duration += item.duration;
      });
      var min = Math.floor(duration/60);
      var sec = duration % 60;
      duration = (min==0 && sec==0) ? 0 : min+':'+sec;
      return duration;
    },
  }
};

