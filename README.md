# aquadock
Install the Aquarium development environment with Docker.

## How to run Aquarium locally in a Docker container
1. [Install Docker](https://docs.docker.com/engine/installation/)
2. Clone this repository
```bash
git clone https://github.com/klavinslab/aquadocked/
```
3. From inside `/aquadocked`, build the Aquarium image. Grab a coffee or check [HN](https://news.ycombinator.com/).
```bash
docker build -f Dockerfile --force-rm -t aq ./
```
*You may need to prepend `sudo` to your `docker` commands if you haven't set up a "docker" user group.*
4. Run the Aquarium image
```bash
docker run -t -p 3000:3000 -p 3501:3501 aq
```
5. Connect to it at [localhost:3000](localhost:3000)!


## Help! My Docker container is still running even though I did Ctrl+C!
Never fear, Docker thought of this. List all running containers with
```bash
docker ps
```
Kill containers with
```bash
docker kill <container-id>
```
Kill all running containers with
```bash
docker kill $(docker ps -q)
```
For more info about Docker cleanup, check [this](https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes) out.
