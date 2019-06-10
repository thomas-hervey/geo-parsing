# import MySQLdb
# db=MySQLdb.connect(
#   host='localhost',
#   user='root',
#   passwd='MQZ(mp1100',
#   database='OpenData'
# )

# print(db)

# c=db.cursor()
# c.execute("""SELECT * FROM total_search_uniques LIMIT 100""")
# c.fetchone()



import mysql.connector

mydb = mysql.connector.connect(
  host='localhost',
  user='root',
  passwd='MQZ(mp1100',
  database='OpenData'
)

print(mydb)

mycursor = mydb.cursor()


sql_query = 'SELECT * FROM total_search_uniques LIMIT 10000'
mycursor.execute(sql_query)

for (result) in mycursor:
  print(result)

mycursor.close()
mydb.close()
