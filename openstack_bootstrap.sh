#!/bin/bash
sudo apt-get -y update
sudo apt-get -y install npm
sudo ln -s /usr/bin/nodejs /usr/bin/node
sudo npm install -g bower
sudo npm install -g sails
cd ~
git clone https://github.com/maikschneider/screenapp.git
cd screenapp/app/assets
bower install
cd ..
npm install
sudo sails lift --prod

exit 0