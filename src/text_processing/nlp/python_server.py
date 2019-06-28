from flask import Flask
from flask import request

app = Flask(__name__)


import spacy_nlp

from nltk.corpus import wordnet as wn


# from mordecai import Geoparser
# geo = Geoparser()

import json


@app.route('/')
def hello():
    return "Hello World!\n This python server is used for processing query logs. Routes include '/test_route/', '/spacy/', '/mordecai/'"


@app.route('/test_route/')
def thing():
    return "this is a test route! To parse a query, use 'http://127.0.0.1:5000/parse/?sentence=...' "


@app.route("/spacy/")
def parse_text():
  try:
      # pull off query string arg from url
      query_string = request.args.get('query_string')

      # nlp parse string using spaCy
      string_details = spacy_nlp.parse(query_string)

      # convert to JSON
      as_json = json.dumps(string_details)
      return as_json
  except:
    print('there was an exception to route /spacy/')

@app.route("/nltk/")
def nltk():
  try:
    # pull off query string arg from url
    query_string = request.args.get('query_string')


  except:
    print('there was an exception running /wn/')


# TODO: add mordecai when needed
# @app.route("/mordecai/")
# def geoparse_text():
#   try:
#     # pull off query string arg from url
#     query_string = request.args.get('query_string')

#     # geoparse query string
#     geoparsed = geo.geoparse(query_string)
#     # TODO: parse as json & return. Seemed to be having a server error

#     print(geoparsed)
#     # return geoparsed
#     return 'hi there'
#   except:
#      print('there was an exception running /mordecai/')


if __name__ == '__main__':
    app.run()