//
//  TwitterPlaylistItem.swift
//  SCC16iOSClient
//
//  Created by Chryb on 28.11.16.
//  Copyright © 2016 Chryb. All rights reserved.
//

import Foundation

class TwitterPlaylistItem: PlaylistItem {
    
    var twitterFilter: String
    var twitterTweetDuration: Int
    var twitterShowRetweets: Bool
    
    init(name: String, duration: Int, appType: String, data: [String: Any], twitterFilter: String, twitterTweetDuration: Int, twitterShowRetweets: Bool) {
        super.init(name: name, duration: duration, appType, data: data)
        self.twitterFilter = twitterFilter
        self.twitterTweetDuration = twitterTweetDuration
        self.twitterShowRetweets = twitterShowRetweets
    }
    
}
