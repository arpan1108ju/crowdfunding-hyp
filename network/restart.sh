docker start $(docker ps -a -q -f "status=exited")
