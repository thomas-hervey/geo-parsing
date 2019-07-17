echo "add the GPG key for the official Docker repository to your system"
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

echo "Add the Docker repository to APT sources:"
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

echo "update package database"
sudo apt-get update

echo "Make sure you are about to install from the Docker repo instead of the default Ubuntu 16.04 repo:"
apt-cache policy docker-ce

echo "install docker"
sudo apt-get install -y docker-ce

echo "check that docker is running"
sudo systemctl status docker


# echo "removing existing docker installations"
# sudo apt-get remove docker docker-engine docker.io

# echo "installing docker.io"
# sudo apt install docker.io

echo "setting docker to run at start up"
sudo systemctl start docker
sudo systemctl enable docker

dockerVersion = $(docker --version);
echo "docker version: ${dockerVersion}"

echo "avoid typing sudo whenever you run the docker command"
sudo usermod -aG docker ${USER}
su - ${USER}

echo "confirm that the user is added to the group"
id -nG