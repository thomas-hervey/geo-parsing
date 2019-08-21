from flask import Flask
from flask import request

# create flask app
app = Flask(__name__)

# import spacy for nlp
import spacy_nlp

# import wordnet for synsets
from nltk.corpus import wordnet as wn

# import mordecai for geoparsing
from mordecai import Geoparser
geo = Geoparser()

import json


@app.route('/')
def hello():
    return "Hello World!\n This python server is used for processing query logs. Routes include '/test_route/', '/spacy/', '/nltk/' '/mordecai/'"


@app.route('/test_route/')
def thing():
    return """this is a test route! To parse a query, use 'http://127.0.0.1:5000/spacy/?query_string=...' \n
      There are other providers like nltk. This is accessable at http://127.0.0.1:5000/nltk/?query_string=..."""


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

@app.route("/nltk/synsets/")
def nltk():
  try:
    # pull off query string arg from url
    query_string = request.args.get('query_string')

    res = wn.synsets(query_string)
    res = str(res)
    return res

  except:
    print('there was an exception running /wn/')


@app.route("/mordecai/")
def mordecai_geoparser():
  try:
    # pull off query string arg from url
    query_string = request.args.get('query_string')

    # geoparse query string
    geoparsed = geo.geoparse(query_string)

    geoparsed = str(geoparsed)

    return geoparsed
  except:
     print('there was an exception running /mordecai/')


if __name__ == '__main__':
    app.run(threaded=True)