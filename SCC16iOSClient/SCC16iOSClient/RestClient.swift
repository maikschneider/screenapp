//
//  RestClient.swift
//  SCC16iOSClient
//
//  Created by Chryb on 22.11.16.
//  Copyright © 2016 Chryb. All rights reserved.
//

import Foundation
import RestEssentials

class RestClient {
    
    let prefix: String = "http://"
    
    func get(url: String, callback: @escaping (RestEssentials.JSON) -> Void) {
        guard let rest = RestController.make(urlString: prefix + url) else {
            print("Bad URL")
            return
        }
        print(rest)
        
        rest.get { result, httpResponse in
            do {
                let json = try result.value()
                callback(json)
            } catch {
                print("Error performing GET: \(error)")
            }
        }
    }
    
    func parsePlaylists(json: RestEssentials.JSON) -> [Playlist] {
        print(json)
        
        var playlists = [Playlist]()
        
        for playlist in json {
            var screens = [Screen]()
            var items = [PlaylistItem]()
            
            for screen in json["screens"] {
                screens.append(
                    Screen(name: screen["name"].string, listId: screen["list"].int, createdAt: screen["createdAt"].string, updatedAt: screen["updatedAt"].string, id: screen["id"].int)
                )
            }
            
            for item in json["items"] {
                
                let appType: String = item["appType"].string
                let name = item["name"].string
                let duration = item["duration"].int
                let id = item["id"].int
                
                var playlistItem: PlaylistItem
                
                switch appType {
                // parse twitter playlist item
                case "twitter":
                    playlistItem = TwitterPlaylistItem(
                        id: id, name: name, duration: duration, appType: appType, data: [:],
                        filter: item["twitterFilter"].string,
                        tweetDuration: item["twitterTweetDuration"].int,
                        showRetweets: item["twitterShowRetweets"].bool
                    )
                    break
                    
                // parse message playlist item
                case "msg":
                    playlistItem = MessagePlaylistItem(
                        id: id, name: name, duration: duration, appType: appType, data: [:],
                        headline: item["headline"].string,
                        text: item["text"].string,
                        image: item["image"].string
                    )
                    break
                    
                // parse weather playlist item
                case "weather":
                    playlistItem = WeatherPlaylistItem(
                        id: id, name: name, duration: duration, appType: appType, data: [:],
                        locationCode: item["weatherLocation"].string,
                        unit: true,//item["weatherUnit"].bool
                        fontColor: item["fontColor"].string,
                        backgroundImage: item["backgroundImage"].string
                    )
                    break
                    
                default:
                    playlistItem = nil
                }
                
                if playlistItem != nil {
                    items.append(playlistItem)
                }
                
            }
            
            playlists.append(Playlist(name: json["name"].string, live: json["live"].bool, createdAt: json["createdAt"].string, updatedAt: json["updatedAt"].string, id: json["id"].int, screens: screens, items: items))
        }
        
        return playlists
    }
    
}

let restClient = RestClient()
