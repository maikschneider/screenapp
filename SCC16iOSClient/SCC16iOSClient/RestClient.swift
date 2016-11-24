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
    
    func get(url: String) {
        guard let rest = RestController.make(urlString: prefix + url) else {
            print("Bad URL")
            return
        }
        
        rest.get { result, httpResponse in
            do {
                let json = try result.value()
                print(json.string)
            } catch {
                print("Error performing GET: \(error)")
            }
        }
    }
    
}

let restClient = RestClient()
