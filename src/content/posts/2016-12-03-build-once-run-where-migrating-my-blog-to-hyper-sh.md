---
title: "Build once run where? Migrating my blog to hyper.sh"
description: "Docker's motto is build once, run everywhere. I put that to the test by migrating my containerized blog to a new Docker hosting platform called Hyper.sh."
date: "2016-12-03"
published: "2016-12-03T09:59:49.000-08:00"
slug: "build-once-run-where-migrating-my-blog-to-hyper-sh"
tags: ["docker", "hypersh", "ghost"]
deadImages: []
---

A few months ago, I ran into a cool new product called [hyper.sh](https://console.hyper.sh/register/invite/Rnw0bmKER7TqrxE2owaGuWNk5Jjp4zU8), a Docker container hosting platform. The goal of hyper.sh is to make it easier to deploy your containerized applications to the cloud by replicating the Docker command-line experience.

[![http://hyper.sh](/content/images/2016/12/Screenshot-2016-12-02-17.09.22.png)](https://console.hyper.sh/register/invite/Rnw0bmKER7TqrxE2owaGuWNk5Jjp4zU8)

Since I'm already running this blog inside of a container and the promise of Docker is to build once, run everywhere, I wanted to see how easy and how much cheaper it would be to migrate from a $5 [Digital Ocean](https://m.do.co/c/7e737c9c7d00) instance to hyper.sh.

## Current Setup

I'm running my Ghost blog on a Ubuntu 16.04 $5 [Digital Ocean](https://m.do.co/c/7e737c9c7d00) droplet.

![](/content/images/2016/12/Screenshot-2016-12-02-17.26.59-1.png)

I use a local directory (`/var/www/ghost`) to keep my persistent data, and use the [official ghost](https://hub.docker.com/_/ghost/) image directly, passing in `NODE_ENV=production` and forwarding port `80` to the internal port `2368`.

```terminal
➜  ~ docker run -d --name ghost-blog -v /var/www/ghost:/var/lib/ghost \
--restart always -e "NODE_ENV=production" \
-p 2368:2368 ghost
```

## Migrating to Hyper.sh

The migration to hyper.sh was surprisingly straightforward.

- [Create an account](https://console.hyper.sh/register/invite/Rnw0bmKER7TqrxE2owaGuWNk5Jjp4zU8).
- [Generate credentials](https://docs.hyper.sh/GettingStarted/generate_api_credential.html) on the web UI.
- Install `hyper` by doing `brew install hyper`.
- Configure `hyper` by running `hyper config` command and provide the API credentials.

At this point we have a working hyper.sh installation, and we're ready to run any container.

```terminal
➜  hyper run -it alpine sh
Unable to find image 'alpine:latest' in the current region
latest: Pulling from library/alpine

3690ec4760f9: Pull complete
Digest: sha256:1354db23ff5478120c980eca1611a51c9f2b88b61f24283ee8200bf9a54f2e5c
Status: Downloaded newer image for alpine:latest

/ #
```

The next step was to migrate my current Ghost data. This turned out to also be surprisingly easy since hyper.sh supports [uploading local files](https://docs.hyper.sh/Feature/storage/volume.html) when creating a new volume on run.

When running a container with a volume that points to a local path, hyper.sh will automatically upload the data and create a new (10GB) volume for us. So all I had to do was download the current Ghost blog directory from my DO instance to my laptop, and do `hyper run`:

```terminal
➜ scp -r ghost@ghost:/var/www/ghost/ ghost
➜ hyper run -v ./ghost_data:/var/lib/ghost alpine sh
Sending ghost_data 312 / 312 [=========================] 100.00% 27s
➜ hyper volume ls
DRIVER              VOLUME NAME                                                       SIZE                CONTAINER
hyper               794b1...a0f184   10 GB               66d5943a5ab1
```

With the data uploaded to the remote volume, we just have to run the Ghost blog with the same arguments we were using to run it before (inside of the DO droplet), except for `-v` that now needs the volume ID instead of the path to the data:

```terminal
➜ hyper run -d --name ghost-blog -v 794b1...a0f184:/var/lib/ghost \ 
--restart always -e "NODE_ENV=production" -p 80:2368 ghost
➜ hyper logs -f ghost-blog

Ghost is running in production...
Your blog is now available on http://diogomonica.com
Ctrl+C to shut down
```

The final step we have to take is to get ourselves a publicly routable IP address, and attach it to our `ghost-blog` container. We can do that easily by running the `hyper fip allocate` and `hyper fip attach` commands:

```terminal
➜ hyper hyper fip allocate 1
209.177.92.130
➜ hyper fip attach 209.177.92.130 ghost-blog
➜ ➜  ~ curl 209.177.92.130
<!DOCTYPE html>
<html>
<head>
...
```

## Monthly cost

The pricing of hyper.sh is more complicated than the simple $5 a month for Digital Ocean. Here is a link to the [pricing page](https://hyper.sh/pricing.html).

They charge $5.18 for the default S4 container size (512MB of ram), $1 for the public IP address, and $0.1 for the first GB of image storage, bringing the TCO to $6.28.

> What?

Yup. Turns out using the default container size for the blog would actually be more expensive than using the smallest Digital Ocean droplet. Fortunately hyper.sh has smaller sizes to offer:

![](/content/images/2016/12/Screenshot-2016-12-02-18.22.09.png)

You can change the container size by using the `--size=SIZE` option when doing `hyper run`. I wasn't able to make the S1 or S2 sizes work due memory constraints. The S3 size, however, worked great, bringing the total cost of running my blog down from $5 to $3.69. A whole dollar and 31 cents of savings per month!!

## Conclusion

I was really impressed by how easy and seamless it was to migrate from DO to hyper.sh. I was expecting more than $1.31 of savings, but the fact that I no longer have to manage/update the underlying OS is the major advantage that hyper.sh is providing its users.
