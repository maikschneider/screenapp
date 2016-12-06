//
//  Screen.swift
//  SCC16iOSClient
//
//  Created by Chryb on 28.11.16.
//  Copyright © 2016 Chryb. All rights reserved.
//

import Foundation

class Screen: NSObject {
    
    var name: String
    var listId: Int
    var createdAt: String
    var updatedAt: String
    var id: Int
    
    init(name: String, listId: Int, createdAt: String, updatedAt: String, id: Int) {
        self.name = name
        self.listId = listId
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.id = id
    }
    
}
