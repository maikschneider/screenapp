module.exports = {

  run: function(playlistitem) {

    // @todo: receive data
    //
    // @todo: update item (optional)
    //
    // message subscribers
    // http://sailsjs.com/documentation/reference/web-sockets/resourceful-pub-sub/message

    PlaylistItem.message(playlistitem.id, {

    }, null, {previous: playlistitem});
  }

}
