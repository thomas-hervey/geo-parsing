echo "activating local pyenv"
BASE_PATH=$(basename `pwd`)
pyenv local $BASE_PATH

echo "starting python server"
python python_server.py

echo "starting mordecai docker elasticsearch container"
docker run -d -p 127.0.0.1:9200:9200 -v $(pwd)/geonames_index/:/usr/share/elasticsearch/data elasticsearch:5.5.2