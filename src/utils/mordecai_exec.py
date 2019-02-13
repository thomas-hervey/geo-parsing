import sys
print(sys.executable)
from mordecai import Geoparser
geo = Geoparser()

def main():
  print "This is the name of the script: ", sys.argv[0]
  print "Number of arguments: ", len(sys.argv)
  print "The arguments are: " , str(sys.argv)
  print 'hello there'
  thing = geo.geoparse("I traveled from Oxford to Ottawa.")
  print thing

  sys.stdout.flush()

if __name__ == '__main__':
    main()