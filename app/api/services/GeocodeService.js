module.exports = {

  getCoordinatesByLocationName: function(location, cb) {

    console.log('Geocode ' + location);

    var NodeGeocoder = require('node-geocoder');
    var options = {
      // provider: 'google',

      // // Optional depending on the providers
      // httpAdapter: 'https', // Default
      // apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, Google Premier
      // formatter: null         // 'gpx', 'string', ...
      provider: 'openstreetmap'
    };
    var geocoder = NodeGeocoder(options);

    geocoder.geocode(location, function(err, res){
      console.log(res);

      if(cb) return cb(res);
    });

  },

}
