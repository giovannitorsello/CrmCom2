docker system prune -a
docker rm $(docker ps -q -f 'status=exited')
docker rmi $(docker images -q -f "dangling=true")
#docker-compose build --no-cache
