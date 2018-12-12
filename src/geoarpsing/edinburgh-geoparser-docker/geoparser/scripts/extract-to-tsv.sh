!/bin/sh
# Author: Beatrice Alex
# Date: 28-01-2016
# Description: Extract the Geoparser geo-resolution output to csv
usage="./extract-to-csv < file.out.xml"
. `dirname $0`/setup

# while loop to set up the arguments specified when running the script. If the
# arguments are wrong it exits the script and prints the usage
while test $# -gt 0
do
    arg=$1
    shift
    case $arg in
	*)
	    echo "This script does not require any parameters, just a file as stdin"
	    echo "usage: $usage" >&2
	    exit 2
    esac
done

lxprintf -e "ent[@type='location']" "%s\t%s\t%s\t%s\t%s\n" "normalize-space(parts)" "@gazref" "@in-country" "@lat" "@long"
