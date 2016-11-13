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
        
        guard let rest = RestController.make(urlString: "http://httpbin.org/get") else {
            print("Bad URL")
            return
        }
        
        rest.get { result, httpResponse in
            do {
                let json = try result.value()
                print(json["url"].string as Any) // "http://httpbin.org/get"
            } catch {
                print("Error performing GET: \(error)")
            }
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

