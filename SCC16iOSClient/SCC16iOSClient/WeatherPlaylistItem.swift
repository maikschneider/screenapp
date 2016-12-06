//
//  WeatherPlaylistItem.swift
//  SCC16iOSClient
//
//  Created by Chryb on 28.11.16.
//  Copyright © 2016 Chryb. All rights reserved.
//

import Foundation

class WeatherPlaylistItem: PlaylistItem {
    
    var location: String
    var unit: Bool
    var fontColor: String
    var backgroundImage: String
    
    init(id: Int, name: String, duration: Int, appType: String, data: [String: Any], location: String, unit: Bool, fontColor: String, backgroundImage: String) {
        super.init(id: id, name: name, duration: duration, appType, data: data)
        self.location = location
        self.unit = unit
        self.fontColor = fontColor
        self.backgroundImage = backgroundImage
    }
    
}
