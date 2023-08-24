localFolder="/home/$USER/mongo_data"
docker run -d -p 27017:27017 --name mongodb -v $localFolder:/data/db mongo:latest