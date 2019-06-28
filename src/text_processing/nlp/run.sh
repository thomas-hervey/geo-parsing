# create a virtual environment
python3 -m venv env

# activate virtual env
source env/bin/activate

# install python dependencies
pip install -r requirements.txt

# star python server
python3 spacy_server.py