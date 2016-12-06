//
//  Playlist.swift
//  SCC16iOSClient
//
//  Created by Chryb on 28.11.16.
//  Copyright © 2016 Chryb. All rights reserved.
//

import Foundation

class Playlist: NSObject {
    
    var name: String
    var live: Bool
    var createdAt: String
    var updatedAt: String
    var id: Int
    
    var screens: [Screen]
    var items: [PlaylistItem]
    
    init(name: String, live: Bool, createdAt: String, updatedAt: String, id: Int) {
        self.name = name
        self.live = live
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.id = id
        
        self.screens = [Screen]()
        self.items = [PlaylistItem]()
    }
    
}
