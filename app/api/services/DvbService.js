'use strict';

const dvb = require('dvbjs');
const BaseAppService = require("./BaseAppService");

module.exports = class DvbService extends BaseAppService {

  constructor(){
    super();
    this.cacheTimeInMin = 0;
  }

  getData(callback) {
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
