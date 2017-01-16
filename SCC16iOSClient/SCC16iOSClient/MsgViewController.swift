//
//  MsgViewController.swift
//  SCC16iOSClient
//
//  Created by Chryb on 15.01.17.
//  Copyright © 2017 Chryb. All rights reserved.
//

import UIKit

class MsgViewController: UIViewController {

    @IBOutlet weak var nameLabel: UILabel!
    
    @IBOutlet weak var msgView: UIView!
    @IBOutlet weak var headlineLabel: UILabel!
    @IBOutlet weak var textLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        msgView.layer.cornerRadius = 5.0
    }
    
    func setup(headline: String, text: String) {
        headlineLabel.text = headline
        textLabel.text = text
    }

}
