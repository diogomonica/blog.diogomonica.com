---
title: "Dead Simple HTTPd in Python"
description: "Python's built-in SimpleHTTPServer: one command to serve a directory over HTTP and move files between hosts with wget."
date: "2011-04-11"
published: "2011-04-11T14:59:00.000-07:00"
slug: "dead-simple-httpd-in-python"
tags: ["python"]
deadImages: []
---

Sometimes, this is all you need:

```console
glow:~ dmonica$ python -m SimpleHTTPServer 8000

Serving HTTP on 0.0.0.0 port 8000 ...
```

This simple command has saved me hours of precious time. I've even used it to transfer files between multiple hosts (HTTP server on one end, one wget on all the other hosts). More details here.
