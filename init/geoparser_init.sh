echo "updating apps"
sudo apt-get update

echo "*** init edinburgh geoparser ***"
echo "TBD"


echo "*** init mordecai geoparser ***"

echo "pulling elasticsearch contianer"
docker pull elasticsearch:5.5.2

echo "getting geonames_index for mordecai"
wget https://s3.amazonaws.com/ahalterman-geo/geonames_index.tar.gz --output-file=wget_log.txt
tar -xzf geonames_index.tar.gz