var dvb = require('dvbjs');

module.exports = {

  cacheTimeInMin: 1,

  getData: function(callback) {
    var _this = this;
    var stopName = this.playlistitem.dvbStop;
    var timeOffset = 0;
    var numResults = 12;

    dvb.monitor(stopName, timeOffset, numResults, function(err, data) {
        if (err) {
          sails.log.error(err);
        }
        if(data) _this.data = data;
        callback();
    });
  }

}
