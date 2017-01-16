//
//  ViewController.swift
//  SCC16iOSClient
//
//  Created by Chryb on 13.11.16.
//  Copyright © 2016 Chryb. All rights reserved.
//

import UIKit
import RestEssentials

class ViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {

    @IBOutlet weak var tableView: UITableView!
    
    var playlists: [Playlist] = []
    var selectedPlaylist: Playlist?
    
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
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        selectedPlaylist = playlists[indexPath.row]
    }
    
    // add to playlist
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "PlayPlaylist" {
            guard let viewController = segue.destination as? PlaylistViewController else {
                return
            }
            
            guard selectedPlaylist != nil else {
                return
            }
            
            viewController.playlist = selectedPlaylist
        }
    }

}

