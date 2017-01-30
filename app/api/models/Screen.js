/**
 * Screen.js
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

    list: {
      model: 'playlist'
    },
    user: {
      model: 'user'
    },

    toJSON: function () {
      var obj = this.toObject();
      delete obj.user;
      return obj;
    },
  }
};

