docker stop $(docker ps -q)
docker rm -f $(docker ps -aq)

docker volume prune -f --all
docker network prune -f

./scripts/rm-folders.sh



# docker container rm *