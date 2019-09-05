import nltk
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import re

from nltk.collocations import BigramAssocMeasures, BigramCollocationFinder

from operator import itemgetter



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

# mycursor = mydb.cursor()


# sql_query = 'SELECT * FROM total_search_uniques LIMIT 5000'
# mycursor.execute(sql_query)

import psycopg2
conn = psycopg2.connect(host="localhost",database="QueryLogs", user="thomashervey")
curr = conn.cursor()

curr.execute('SELECT * FROM keywords')

terms = []

for row in curr:
  searchUniques = row[1]
  keywords = (' !^!^!^!^!^ ' + row[0] + ' ') * int(searchUniques)

  print(keywords)
  break


  # add a string of unusual chars to the end of a result so that it's picked up when listing bigrams
  query = keywords
  query = query + ' !^!^!^!^!^ '
  terms.append(query)

# doc_1 = 'Convolutional Neural Networks are very similar to ordinary Neural Networks from the previous chapter'
# doc_2 = 'Convolutional Neural Networks take advantage of the fact that the input consists of images and they constrain the architecture in a more sensible way.'
# doc_3 = 'In particular, unlike a regular Neural Network, the layers of a ConvNet have neurons arranged in 3 dimensions: width, height, depth.'
# docs = [doc_1, doc_2, doc_3]
docs = terms
docs = (' '.join(filter(None, docs))).lower()

tokens = word_tokenize(docs)
tokens = [t for t in tokens if t not in stop_words]

word_l = WordNetLemmatizer()
tokens = [word_l.lemmatize(t) for t in tokens if t.isalpha()]

bi_grams = list(ngrams(tokens, 2))
counter = Counter(bi_grams)
# print(counter.most_common(50))

# mycursor.close()
# mydb.close()


word_dict = {}

for i in range(50):
    word_dict[' '.join(counter.most_common(50)[i][0])] = counter.most_common(50)[i][1]


print (counter.most_common(50)[0][1])
print (counter.most_common(50)[49][1])

# -----

# Set word cloud params and instantiate the word cloud.
# The height and width only affect the output image file.
WC_height = 500
WC_width = 1000
WC_max_words = 100

wordCloud = WordCloud(max_words=WC_max_words, height=WC_height, width=WC_width, background_color="white", contour_color="white")

wordCloud.generate_from_frequencies(word_dict)

# plt.title('Most frequently occurring bigrams connected with an underscore_')
plt.imshow(wordCloud, interpolation='bilinear')
plt.axis("off")
plt.show()

wordCloud.to_file("WordCloud_Bigrams_frequent_words.png")

# The following is in case you want to use PowerBI instead of the Python word cloud
with open('Bigrams_frequent_words.csv', 'w') as f:
    [f.write('{0},{1}\n'.format(key, value)) for key, value in word_dict.items()]
f.close()


# -----

# # Rather than show the most frequently occurring words, show the least frequent
# # and maybe more important, salient words.

# print("\nWord cloud with least frequently occurring bigrams (connected with an underscore _).")

# # On large data sets (>100 for example) there can be a large number of words that occur once.
# # Depending on the max words specified in the word cloud, you can get 30 words of various
# # sizes but they only occur once.

# # Sort the list to put the least common terms at the front/top.
# # Infrequent start at the scoredList[0]. The MOST frequent word appears in
# # the last position at scoredList[len(scored)-1]

# # Sort lowest to highest based on the score.
# scoredList = sorted(scored, key=itemgetter(1))

# scoredListLen = len(scoredList)-1

# # There is no need to stuff the dictinary with more words than will be
# # rendered by the word cloud. A counter below will ensure the dictionary
# # doesn't exceed the prior max words configured in the word cloud above.
# maxLenCnt = 0

# # Below MIN SCORE is the minimum score from score_ngrams(bigram_measures.raw_freq)
# # that a N-gram need to achieve to be included in the word cloud. This is based
# # solely on looking at N-gram score and manual configuration.
# MINSCORE = 0.000265

# # Index for the scored list
# indx = 0

# # Find the starting point in the SORTED list where the score of a term
# # is greater than MIN SCORE defined above.
# while (indx < scoredListLen) and (scoredList[indx][1] < MINSCORE):
#     indx += 1
#     #print("Indx: ", indx)
#     #print(scoredList[indx])

# # dictionary to hold the scored list with the chosen scores.
# word_dict2 = {}

# # Create the dictionary with the bigrams using the starting point found above.
# while (indx < scoredListLen) and (maxLenCnt < WC_max_words):
#     word_dict2['_'.join(scoredList[indx][0])] = scoredList[indx][1]
#     indx +=  1
#     maxLenCnt += 1

# # Ensure the dictionary isn't empty before creating word cloud.
# if len(word_dict2) > 0:
#     wordCloud.generate_from_frequencies(word_dict2)
#     plt.title('Least frequently occurring bigrams connected with an underscore_')
#     plt.imshow(wordCloud, interpolation='bilinear')
#     plt.axis("off")
#     plt.show()
#     wordCloud.to_file("WordCloud_Bigrams_Infrequent_words.png")
# else:
#     print("\nThere were no words to display in the word cloud.")

# # The following is in case you want to use PowerBI instead of the Python word cloud
# with open('Bigrams_infrequent_words.csv', 'w') as f:
#     [f.write('{0},{1}\n'.format(key, value)) for key, value in word_dict.items()]
#     f.close()






curr.close()
conn.close()