//
//  PlaylistViewController.swift
//  SCC16iOSClient
//
//  Created by Chryb on 15.01.17.
//  Copyright © 2017 Chryb. All rights reserved.
//

import UIKit
import SocketIO

class PlaylistViewController: UIViewController {

    @IBOutlet weak var twitterView: UIView!
    @IBOutlet weak var weatherView: UIView!
    @IBOutlet weak var msgView: UIView!
    
    var playlist: Playlist?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        guard playlist != nil else {
            return
        }
        
        let url = URL(string: "http://127.0.0.1:1337")!
        let path = "/screen/live/" + String(playlist!.screens[0].id)
        
        let socket = SocketIOClient(socketURL: url, config: [.log(true), .forcePolling(false), .path(path)])
        
        socket.on("connect") {data, ack in
            print("socket connected")
        }
        
        socket.on("error") {data, ack in
            print("error")
        }
        
        socket.on("itemUpdate") {data, ack in
            print("item update")
        }
        
        socket.on("slideChange") {data, ack in
            print("slide change")
        }
        
        socket.on("tweetChange") {data, ack in
            print("tweet change")
        }
        
        socket.connect()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    func showTwitterView(playlistItem: TwitterPlaylistItem) {
        UIView.animate(withDuration: 0.5, animations: {
            self.twitterView.alpha = 1
            self.weatherView.alpha = 0
            self.msgView.alpha = 0
        })
    }
    
    func showWeatherView(playlistItem: WeatherPlaylistItem) {
        UIView.animate(withDuration: 0.5, animations: {
            self.twitterView.alpha = 0
            self.weatherView.alpha = 1
            self.msgView.alpha = 0
        })
    }
    
    func showMsgView(playlistItem: MessagePlaylistItem) {
        UIView.animate(withDuration: 0.5, animations: {
            self.twitterView.alpha = 0
            self.weatherView.alpha = 0
            self.msgView.alpha = 1
        })
    }

}
