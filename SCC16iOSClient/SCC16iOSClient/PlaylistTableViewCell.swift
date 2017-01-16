//
//  PlaylistTableViewCell.swift
//  SCC16iOSClient
//
//  Created by Chryb on 15.01.17.
//  Copyright © 2017 Chryb. All rights reserved.
//

import UIKit

class PlaylistTableViewCell: UITableViewCell {

    @IBOutlet weak var idLabel: UILabel!
    @IBOutlet weak var nameLabel: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
    }
    
    public func setup(id: Int, name: String) {
        idLabel.text = String(id)
        nameLabel.text = name
    }

}
