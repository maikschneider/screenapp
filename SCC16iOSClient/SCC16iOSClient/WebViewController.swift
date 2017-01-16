//
//  WebViewController.swift
//  SCC16iOSClient
//
//  Created by Chryb on 16.01.17.
//  Copyright © 2017 Chryb. All rights reserved.
//

import UIKit

class WebViewController: UIViewController, UIWebViewDelegate {

    @IBOutlet weak var webView: UIWebView!
    
    var screenId: String?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        guard screenId != nil else {
            return
        }

        webView.delegate = self
        
        webView.loadRequest(URLRequest(url: URL(string: "http://127.0.0.1:1337/screen/play/" + screenId!)!))
    }


}
