//
//  PlaylistItem.swift
//  SCC16iOSClient
//
//  Created by Chryb on 28.11.16.
//  Copyright © 2016 Chryb. All rights reserved.
//

import Foundation

class PlaylistItem: NSObject {
    
    var name: String
    var duration: Int
    var appType: String
    var data: [String: Any]
    
    init(name: String, duration: Int, appType: String, data: [String: Any]) {
        self.name = name
        self.duration = duration
        self.appType = appType
        self.data = data
    }
    
}
