//
//  PlaylistViewController.swift
//  SCC16iOSClient
//
//  Created by Chryb on 15.01.17.
//  Copyright © 2017 Chryb. All rights reserved.
//

import UIKit

class PlaylistViewController: UIViewController {

    @IBOutlet weak var twitterView: UIView!
    @IBOutlet weak var weatherView: UIView!
    @IBOutlet weak var msgView: UIView!
    
    var playlist: Playlist?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        
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
