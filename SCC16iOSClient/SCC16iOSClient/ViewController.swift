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
            print(json)
            
            print("Screen name: " + json[0]["screens"][0]["name"].string!)
            print("Playlist name: " + json[0]["name"].string!)
            print("Playlist Id: " + json[0]["id"].int!)
            
            var screens = []
        }
        
        restClient.get(url: "localhost:1337/playlist", callback: printJson)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }


}

