//
//  ViewController.swift
//  SCC16iOSClient
//
//  Created by Chryb on 13.11.16.
//  Copyright © 2016 Chryb. All rights reserved.
//

import UIKit
import RestEssentials
import SocketIO

class ViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {

    @IBOutlet weak var tableView: UITableView!
    
    var playlists: [Playlist] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.delegate = self
        tableView.dataSource = self
        
        func printJson(json: RestEssentials.JSON) {
            let pl = restClient.parsePlaylists(json: json)
            playlists = pl
            tableView.reloadData()
        }
        
        restClient.get(url: "localhost:1337/playlist", callback: printJson)
        
        let socket = SocketIOClient(socketURL: URL(string: "http://localhost:8080")!, config: [.log(true), forcePolling(true)])
        
        socket.on("connect") {data, ack in
            print("socket connected")
        }
        
        socket.on("itemUpdate") {data, ack in

        }
        
        socket.on("slideChange") {data, ack in
            
        }
        
        socket.on("tweetChange") {data, ack in
            
        }
        
        socket.connect()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return playlists.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let playlist = playlists[indexPath.row]
        let cell = tableView.dequeueReusableCell(withIdentifier: "PlaylistTableViewCell", for: indexPath) as! PlaylistTableViewCell
        cell.setup(id: playlist.id, name: playlist.name)
        return cell
    }
    
    // add to playlist
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "PlayPlaylist" {
            let viewController = segue.destination as? PlaylistViewController
            viewController?.playlist =
        }
    }

}

