//
//  MessagePlaylistItem.swift
//  SCC16iOSClient
//
//  Created by Chryb on 06.12.16.
//  Copyright © 2016 Chryb. All rights reserved.
//

import Foundation

class MessagePlaylistItem: PlaylistItem {
    
    var headline: String
    var text: String
    var image: String
    
    init(id: Int, name: String, duration: Int, appType: String, data: [String: Any], headline: String, text: String, image: String) {
        self.headline = headline
        self.text = text
        self.image = image
        super.init(id: id, name: name, duration: duration, appType: appType, data: data)
    }
}
