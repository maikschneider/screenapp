module.exports = {

  run: function(playlistitem) {

    // Get Data
    var data = {
      temp: '23°C'
    }

    // Update Item
    PlaylistItem.update({id: playlistitem.id}).set({data: data, name: 'Neuername3'}).exec(function(err, updatedPlaylistitems){
      if(err){
        console.log(err);
      }

      console.log('WeatherService updated: ' + updatedPlaylistitems[0].id);

      // broadcast a message to subscribers with updated data
      // see: http://sailsjs.com/documentation/reference/web-sockets/resourceful-pub-sub/publish-update
      PlaylistItem.publishUpdate(updatedPlaylistitems[0].id, {
        data: data
      }, null, {previous: playlistitem});

    });

  }

}
