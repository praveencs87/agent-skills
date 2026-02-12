Build and deploy Docker containers.

## Commands
- **Build**: `docker build -t <name> .`
- **Run**: `docker run -d -p <host>:<container> <name>`
- **Stop**: `docker stop <container-id>`
- **List**: `docker ps -a`
- **Logs**: `docker logs <container-id>`
- **Clean**: `docker system prune -f`

## Docker Compose
- **Start**: `docker-compose up -d`
- **Stop**: `docker-compose down`
- **Rebuild**: `docker-compose up -d --build`

## Best Practices
1. Always check if Docker is installed first: `docker --version`
2. Check if a Dockerfile exists before building
3. Use meaningful tag names: `<project>:<version>`
4. Show container logs after starting to verify it's running
5. Ask user for port mappings if not specified
