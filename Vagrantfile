# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty32"
  config.vm.network "public_network"
  config.vm.provision :shell, path: ".vagrant-provision.sh"
end
