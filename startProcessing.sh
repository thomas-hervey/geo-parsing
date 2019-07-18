#!/bin/sh

start_python_server () {

  cd ./src/text_processing/nlp/
  chmod +x run_python_server.sh
  exec ./run_python_server.sh
}

run_pipeline () {
  echo "run pipeline"
  cd ./src/modify_data/
  node run_pipeline.js
}

start_python_server
