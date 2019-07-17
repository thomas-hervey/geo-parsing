echo "updating apps"
sudo apt-get update

echo "CALLING: docker_init.sh"
chmod x+ ./docker_init.sh
./docker_init.sh

echo "CALLING: geoparser_init.sh"
chmod x+ ./geoparser_init.sh
./geoparser_init.sh

echo "CALLING: mysql_init.sh"
chmod x+ ./mysql_init.sh
./mysql_init.sh

echo "CALLING: init_python_server.sh"
echo "... creating virtualenv env with version 3.7.1"
chmod x+ ./init_python_server.sh
./init_python_server.sh 3.7.1
