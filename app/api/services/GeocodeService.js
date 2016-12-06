module.exports = {

  /**
   * Receive Information for a location string
   * @param  {String}   location
   * @param  {Function} cb       callback function
   * @return {Array}            Objects locations with geolat, geolong, geocode, country etc.
   */
  getCoordinatesByLocationName: function(location, cb) {

    var NodeGeocoder = require('node-geocoder');
    var options = {
      provider: 'openstreetmap'
    };
    var geocoder = NodeGeocoder(options);

    geocoder.geocode(location, function(err, res){

      var data = _.filter(res, function(obj){
        return !_.isUndefined(obj.city);
      });

      if(cb) return cb(data);

      return data;
    });

  },

}
