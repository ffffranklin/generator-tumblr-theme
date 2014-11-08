#!/usr/bin/env bash

NPM_DIR="/usr/local/share/npm"

echo "Provisioning: started..."
echo "Current user is '$USER'"

echo "Provisioning: Installing sass"
gem install sass

echo "Provisioning: Installing node"
apt-get update
apt-get install -y nodejs nodejs-legacy npm git

echo "Provisioning: Installing yeoman and tumblr theme generator"
npm config -g set prefix $NPM_DIR
npm install --no-color -g yo grunt-cli generator-tumblr-theme
chmod -R 775 $NPM_DIR &&  chown -R vagrant $NPM_DIR

echo "export PATH=\"\$PATH:$NPM_DIR/bin\"" >> /home/vagrant/.bashrc

echo "Provisioning: Complete."
