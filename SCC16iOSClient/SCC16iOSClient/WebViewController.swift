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
    
    let endpoint: String = "http://87.190.238.41/screen/play/"
    var screenId: String?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.navigationController?.navigationBar.tintColor = UIColor.white
        
        guard screenId != nil else {
            return
        }

        webView.delegate = self
        
        webView.loadRequest(URLRequest(url: URL(string: endpoint + screenId!)!))
    }


}
