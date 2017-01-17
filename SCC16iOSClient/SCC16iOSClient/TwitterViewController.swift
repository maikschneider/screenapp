//
//  TwitterViewController.swift
//  SCC16iOSClient
//
//  Created by Chryb on 15.01.17.
//  Copyright © 2017 Chryb. All rights reserved.
//

import UIKit

class TwitterViewController: UIViewController {

    @IBOutlet weak var filterLabel: UILabel!
    @IBOutlet weak var nameLabel: UILabel!
    
    @IBOutlet weak var tweetView: UIView!
    @IBOutlet weak var authorImage: UIImageView!
    @IBOutlet weak var authorNameLabel: UILabel!
    @IBOutlet weak var authorUsernameLabel: UILabel!
    @IBOutlet weak var textLabel: UITextView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        tweetView.layer.cornerRadius = 5.0
    }
    
    func setup(filter: String, name: String) {
        filterLabel.text = filter
        nameLabel.text = name
    }
    
    func setupTweet(authorName: String, authorUsername: String, text: String) {
        authorNameLabel.text = authorName
        authorUsernameLabel.text = authorUsername
        textLabel.text = text
    }

}
