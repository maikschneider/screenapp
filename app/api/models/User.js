/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var Passwords = require('machinepack-passwords');

module.exports = {

  attributes: {
    email: {
      type: 'email',
      required: true,
      unique: true,
    },
    password: {
      type: 'string',
      required: true
    },
    name: {
      type: 'string',
      required: true,
    },
    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },


  /**
   * Create a new user using the provided inputs,
   * but encrypt the password first.
   *
   * @param  {Object}   inputs
   *                     • name     {String}
   *                     • email    {String}
   *                     • password {String}
   * @param  {Function} cb
   */

  signup: function (inputs, cb) {
    Passwords.encryptPassword({
      password: inputs.password,
    })
    .exec({
      error: function(err) {
        cb();
      },
      success: function(result) {
        // Create a user
        User.create({
          name: inputs.name,
          email: inputs.email,
          password: result
        })
        .exec(cb);
      }
    });
  },



  /**
   * Check validness of a login using the provided inputs.
   * But encrypt the password first.
   *
   * @param  {Object}   inputs
   *                     • email    {String}
   *                     • password {String}
   * @param  {Function} cb
   */

  attemptLogin: function (inputs, cb) {
    // Create a user
    User.findOne({
      email: inputs.email,
      // TODO: But encrypt the password first
      password: inputs.password
    })
    .exec(cb);
  }
};
