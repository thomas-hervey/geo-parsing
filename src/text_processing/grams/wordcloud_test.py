import nltk
from nltk.corpus import stopwords

from wordcloud import WordCloud
import matplotlib.pyplot as plt

import re

from nltk.collocations import BigramAssocMeasures, BigramCollocationFinder

from operator import itemgetter

WNL = nltk.WordNetLemmatizer()

# -----

def prepareStopWords():

    stopwordsList = []

    # Load default stop words and add a few more specific to my text.
    stopwordsList = stopwords.words('english')
    stopwordsList.append('dont')
    stopwordsList.append('didnt')
    stopwordsList.append('doesnt')
    stopwordsList.append('cant')
    stopwordsList.append('couldnt')
    stopwordsList.append('couldve')
    stopwordsList.append('im')
    stopwordsList.append('ive')
    stopwordsList.append('isnt')
    stopwordsList.append('theres')
    stopwordsList.append('wasnt')
    stopwordsList.append('wouldnt')
    stopwordsList.append('a')
    stopwordsList.append('also')

    return stopwordsList

# -----

# Open the file and read lines
# NOTE: You need to give finder.score_ngrams a sizable corpus to work with.

# input_file = 'movie_data_Movie-The_Matador.txt'
# FILEHEADER = 0

# with open(input_file, 'r') as f:
#     if FILEHEADER:
#         next(f)
#     rawText = f.read()

# # Lowercase and tokenize
# rawText = rawText.lower()


from collections import Counter
from nltk import word_tokenize
from nltk.util import ngrams
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords



stop_words = set(stopwords.words('english'))




import mysql.connector

mydb = mysql.connector.connect(
  host='localhost',
  user='root',
  passwd='MQZ(mp1100',
  database='OpenData'
)

print(mydb)

mycursor = mydb.cursor()


sql_query = 'SELECT dimension_searchKeyword FROM search_refinements'
mycursor.execute(sql_query)

terms = []

for (result) in mycursor:
  # add a string of unusual chars to the end of a result so that it's picked up when listing bigrams
  query = result[0]
  query = query + '!^!^!^!^!^'
  terms.append(query)

# doc_1 = 'Convolutional Neural Networks are very similar to ordinary Neural Networks from the previous chapter'
# doc_2 = 'Convolutional Neural Networks take advantage of the fact that the input consists of images and they constrain the architecture in a more sensible way.'
# doc_3 = 'In particular, unlike a regular Neural Network, the layers of a ConvNet have neurons arranged in 3 dimensions: width, height, depth.'
# docs = [doc_1, doc_2, doc_3]
docs = terms
docs = (' '.join(filter(None, docs))).lower()


# Remove single quote early since it causes problems with the tokenizer.
# wasn't turns into 2 entries; was, n't.
# docs = docs.replace("'", "")

tokens = nltk.word_tokenize(docs)
text = nltk.Text(tokens)

# Load default stop words and add a few more.
stopWords = prepareStopWords()

# Remove extra chars and remove stop words.
text_content = [''.join(re.split("[ .,;:!?‘’``''@#$%^_&*()<>{}~\n\t\\\-]", word)) for word in text]
text_content = [word for word in text_content if word not in stopWords]

# After the punctuation above is removed it still leaves empty entries in the list.
# Remove any entries where the len is zero.
text_content = [s for s in text_content if len(s) != 0]

# Best to get the lemmas of each word to reduce the number of similar words
# on the word cloud. The default lemmatize method is noun, but this could be
# expanded.
# ex: The lemma of 'characters' is 'character'.
text_content = [WNL.lemmatize(t) for t in text_content]

# setup and score the bigrams using the raw frequency.
finder = BigramCollocationFinder.from_words(text_content)
bigram_measures = BigramAssocMeasures()
scored = finder.score_ngrams(bigram_measures.raw_freq)

# By default finder.score_ngrams is sorted, however don't rely on this default behavior.
# Sort highest to lowest based on the score.
scoredList = sorted(scored, key=itemgetter(1), reverse=True)

# word_dict is the dictionary we'll use for the word cloud.
# Load dictionary with the FOR loop below.
# The dictionary will look like this with the bigram and the score from above.
# word_dict = {'bigram A': 0.000697411,
#             'bigram B': 0.000524882}

word_dict = {}

listLen = len(scoredList)

# Get the bigram and make a contiguous string for the dictionary key.
# Set the key to the scored value.
for i in range(listLen):
    word_dict['_'.join(scoredList[i][0])] = scoredList[i][1]


# -----

# Set word cloud params and instantiate the word cloud.
# The height and width only affect the output image file.
WC_height = 500
WC_width = 1000
WC_max_words = 100

wordCloud = WordCloud(max_words=WC_max_words, height=WC_height, width=WC_width)

wordCloud.generate_from_frequencies(word_dict)

plt.title('Most frequently occurring bigrams connected with an underscore_')
plt.imshow(wordCloud, interpolation='bilinear')
plt.axis("off")
plt.show()

wordCloud.to_file("WordCloud_Bigrams_frequent_words.png")

# The following is in case you want to use PowerBI instead of the Python word cloud
with open('Bigrams_frequent_words.csv', 'w') as f:
    [f.write('{0},{1}\n'.format(key, value)) for key, value in word_dict.items()]
f.close()


# -----

# Rather than show the most frequently occurring words, show the least frequent
# and maybe more important, salient words.

print("\nWord cloud with least frequently occurring bigrams (connected with an underscore _).")

# On large data sets (>100 for example) there can be a large number of words that occur once.
# Depending on the max words specified in the word cloud, you can get 30 words of various
# sizes but they only occur once.

# Sort the list to put the least common terms at the front/top.
# Infrequent start at the scoredList[0]. The MOST frequent word appears in
# the last position at scoredList[len(scored)-1]

# Sort lowest to highest based on the score.
scoredList = sorted(scored, key=itemgetter(1))

scoredListLen = len(scoredList)-1

# There is no need to stuff the dictinary with more words than will be
# rendered by the word cloud. A counter below will ensure the dictionary
# doesn't exceed the prior max words configured in the word cloud above.
maxLenCnt = 0

# Below MIN SCORE is the minimum score from score_ngrams(bigram_measures.raw_freq)
# that a N-gram need to achieve to be included in the word cloud. This is based
# solely on looking at N-gram score and manual configuration.
MINSCORE = 0.000265

# Index for the scored list
indx = 0

# Find the starting point in the SORTED list where the score of a term
# is greater than MIN SCORE defined above.
while (indx < scoredListLen) and (scoredList[indx][1] < MINSCORE):
    indx += 1
    #print("Indx: ", indx)
    #print(scoredList[indx])

# dictionary to hold the scored list with the chosen scores.
word_dict2 = {}

# Create the dictionary with the bigrams using the starting point found above.
while (indx < scoredListLen) and (maxLenCnt < WC_max_words):
    word_dict2['_'.join(scoredList[indx][0])] = scoredList[indx][1]
    indx +=  1
    maxLenCnt += 1

# Ensure the dictionary isn't empty before creating word cloud.
if len(word_dict2) > 0:
    wordCloud.generate_from_frequencies(word_dict2)
    plt.title('Least frequently occurring bigrams connected with an underscore_')
    plt.imshow(wordCloud, interpolation='bilinear')
    plt.axis("off")
    plt.show()
    wordCloud.to_file("WordCloud_Bigrams_Infrequent_words.png")
else:
    print("\nThere were no words to display in the word cloud.")

# The following is in case you want to use PowerBI instead of the Python word cloud
with open('Bigrams_infrequent_words.csv', 'w') as f:
    [f.write('{0},{1}\n'.format(key, value)) for key, value in word_dict.items()]
    f.close()