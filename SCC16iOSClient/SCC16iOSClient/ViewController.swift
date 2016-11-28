//
//  ViewController.swift
//  SCC16iOSClient
//
//  Created by Chryb on 13.11.16.
//  Copyright © 2016 Chryb. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        restClient.get(url: "localhost:1337/playlist")
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }


}

