//
//  WeatherPlaylistItem.swift
//  SCC16iOSClient
//
//  Created by Chryb on 28.11.16.
//  Copyright © 2016 Chryb. All rights reserved.
//

import Foundation

class WeatherPlaylistItem: PlaylistItem {
    
    var weatherLocationCode: String
    var weatherUnit: Bool
    
    init(name: String, duration: Int, appType: String, data: [String: Any], weatherLocationCode: String, weatherUnit: Bool) {
        super.init(name: name, duration: duration, appType, data: data)
        self.weatherLocationCode = weatherLocationCode
        self.weatherUnit = weatherUnit
    }
    
}
