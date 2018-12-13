#!/bin/sh
# Author: Beatrice Alex
# Date: 28-01-2016
# Description: Run the Geoparser on multiple text files

usage="./run-multiple-files -i inputDirectory -o outputDirectory"

# check that some options are specified. If not is specified, then
# the script is exited and the usage is printed
if [ $# -eq "0" ]
then
    echo "No arguments specified"
    echo "usage: $usage" >&2
    exit 2
fi

# while loop to set up the arguments specified when running the script. If the
# arguments are wrong it exits the script and prints the usage
while test $# -gt 0
do
    arg=$1
    shift
    case $arg in
	-i)
	    inputdirname=$1
	    shift 1
	    ;;
	-o)
	    outputdirname=$1
	    shift 1
	    ;;
    # -l)
	#     lat=$1
    #     long=$2
    #     radius=$3
    #     score=$4
	#     shift 4
	#     ;;
	*)
	    echo "Wrong argument specified"
	    echo "usage: $usage" >&2
	    exit 2
    esac
done

# for loop to list a set of text files specified in the input directory
# The script is set up to only process files in the input directory which start with "1", "b" or "r" and end in ".txt".  If you would like to process all text files in the specified input directory, change the beginning of the for loop below to: for i in `ls $inputdirname/*.txt

for i in `ls $inputdirname/[1br]*.txt`
do
    # a print statement to say which file is currently being processed
    echo Processing $i

    # the prefix is derived from the file name, i.e. everything before the format
    # extension ".txt"
    prefix=`basename $i ".txt"`

    # each file is then geo-parsed and the output is written to the output directory
    # cat $i | ./run -t plain -g geonames-local -l $lat $long $radius $score -o $outputdirname $prefix
    cat $i | ./run -t plain -g geonames-local -o $outputdirname $prefix
done
