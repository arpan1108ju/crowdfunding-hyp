docker rm -f $(docker ps -aq)

rm -rf fabric-ca/*
rm -rf crypto-config/*
rm -rf crypto-config-ca/*


# docker container rm *