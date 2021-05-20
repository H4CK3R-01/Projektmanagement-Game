# Projektmanagement Game


## Deploy
```
docker run -d -it --rm \
    --publish 8181:80 \
    --volume <path-to-repo>:/usr/share/nginx/html \
    nginx
```

Replace `<path-to-repo>` with the absolute path of your repository.