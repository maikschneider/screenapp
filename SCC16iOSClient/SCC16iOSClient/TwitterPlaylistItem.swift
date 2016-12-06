//
//  TwitterPlaylistItem.swift
//  SCC16iOSClient
//
//  Created by Chryb on 28.11.16.
//  Copyright © 2016 Chryb. All rights reserved.
//

import Foundation

class TwitterPlaylistItem: PlaylistItem {
    
    var filter: String
    var tweetDuration: Int
    var showRetweets: Bool
    
    init(id: Int, name: String, duration: Int, appType: String, data: [String: Any], filter: String, tweetDuration: Int, showRetweets: Bool) {
        super.init(id: id, name: name, duration: duration, appType, data: data)
        self.filter = filter
        self.tweetDuration = tweetDuration
        self.showRetweets = showRetweets
    }
    
}
