//
//  ViewController.swift
//  SCC16iOSClient
//
//  Created by Chryb on 13.11.16.
//  Copyright © 2016 Chryb. All rights reserved.
//

import UIKit
import RestEssentials

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        func printJson(json: RestEssentials.JSON) {
            let playlists = restClient.parsePlaylists(json: json)
            print(playlists)
        }
        
        restClient.get(url: "localhost:1337/playlist", callback: printJson)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }


}

