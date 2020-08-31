[![pipeline status](https://gitlab.com/madflow/imgdmp/badges/master/pipeline.svg)](https://gitlab.com/madflow/imgdmp/commits/master)

# imgdmp (pron: ĭmˈĭjdŭmp)

> A service for uploading and storing images

- [x] Upload images
- [x] Install in seconds
- [x] Self-hosted
- [x] HTTP Bearer authentication strategy for uploads
- [x] Expiry date for images and cron based cleanup

# Quick Start

```ZSH
git clone https://github.com/madflow/imgdmp
cd imgdmp
yarn
# npm install
yarn start
# npm start
```

# Deployment

## Docker

In order to upload in image the environment variable `BEARER_TOKEN=` has to be set. It is your responsibility to provide this variable.

- Docker Compose has the concept of `.env` variables to accomplish this. There is a `env.dist` in the root of this repository that can simply be copied to `.env`.
- The Docker cli accepts environment variables like this: `-e "BEARER_TOKEN=XXXXX"`. Since this would print the secret this method is discouraged.

**Example docker-compose.yml**

```YAML
version: "3"

services:
  imgdmp:
    image: madflow/imgdmp
    ports:
      - 80:3000
    environment:
      - NODE_ENV=production
      - BEARER_TOKEN=${BEARER_TOKEN}
    volumes:
      - imgdmp-data:/app/data

volumes:
  imgdmp-data:
    driver: local
```

**Example Docker run**

```BASH
docker run -v "imgdmp-data:/app/data" -e "NODE_ENV=production" -m "300M" --memory-swap "1G" -p "3000:3000" madflow/imgdmp
```

# Upload an image

**curl**

```ZSH
curl -i -X POST -H "Authorization: Bearer mybearer" -F "image=@myimage.png" http://127.0.0.1:3000/upload/
```

**HTTPie**

```ZSH
http -f http://localhost:3000/upload Authorization:"Bearer mybearer" image@myimage.png
```

# Server Response

```JSON
{
    "expires": "2018-11-11T00:00:00.000Z",
    "fileName": "dbbee845752a21601777fac446332e63.png",
    "id": "MlWQjOtxwy5MEfEB",
    "mimetype": "image/png",
    "originalName": "myimage.png",
    "self": "/images/dbbee845752a21601777fac446332e63.png"
}
```

# Upload form fields

| Field   | Description                      | Example    |
| :------ | :------------------------------- | :--------- |
| image   | The local image                  |            |
| expires | The expiration date of the image | 2018-11-11 |
