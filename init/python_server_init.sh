#!/bin/bash
echo "updating apps"
sudo apt-get update


echo "python version"
python -V

echo "Installing the pyenv"
curl -L https://raw.githubusercontent.com/yyuu/pyenv-installer/master/bin/pyenv-installer | bash

echo "Install dependencies before pyenv"
sudo apt-get update && sudo apt-get upgrade
sudo apt-get install -y make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev git

echo "Add to ~/.bashrc at the end of file"
export PATH="~/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"

echo "pyenv versions"
pyenv versions

echo "install python 3.7.1"
pyenv install 3.7.1

echo "set 3.7.1 globally"
pyenv global 3.7.1

echo "Check if version 3.5.0 is selected with the command"
pyenv versions

echo "Test the python version"
python -V


echo "creating virtualenv"
set -e
if [ -n "$1" ]; then
    PYTHON_VERSION=$1
else
    echo "Please specify a Python version, e.g. 3.7.1";
    exit 1
fi
set +e

BASE_PATH=$(basename `pwd`)
pyenv local $1 && \
python --version && \
python -m venv .venv && \
ln -s `pwd`/.venv ~/.pyenv/versions/$BASE_PATH && \
pyenv local $BASE_PATH
echo "Python virtual env created successfully"

echo "Installing pip requirements"
pip install -r requirements.txt

echo "Downloading spacy english model"
python -m spacy download en_core_web_lg

echo "calling python server shell"
chmod x+ ./run_python_server.sh
./run_python_server.sh