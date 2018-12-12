FROM debian:stable-slim

RUN apt-get update -y

ENV GEOPARSER=/app/geoparser

WORKDIR $GEOPARSER
COPY geoparser-march2016.tar.gz geoparser-v1.1.tar.gz
RUN tar -zxf geoparser-v1.1.tar.gz

WORKDIR $GEOPARSER/geoparser-v1.1/scripts/

CMD bash -c "cat ../in/172172.txt | ./run -t plain -g geonames"
