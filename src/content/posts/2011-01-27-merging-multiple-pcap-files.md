---
title: "Merging multiple .pcap files"
description: "Today I needed to merge 40 ~600Mb .pcap"
date: "2011-01-27"
published: "2011-01-27T13:50:00.000-08:00"
slug: "merging-multiple-pcap-files"
tags: ["tcpdump"]
deadImages: []
---

Today I needed to merge 40 ~600Mb .pcap files into one humongous capture file.

Since I was doing this server sided and I'm a tcpdump.org kind of person, I installed tcpslice.

tcpslice - extracts pieces of and/or merge together tcpdump files

Using tcpslice, I simply did:

```console
root@privato:~/traces# time tcpslice *.pcap -w full.pcap
```

I could have used the mergepcap from the Wireshark package, but I didn't have wireshark installed, and as I mentioned, I'm a tcpdump kind of guy ;).
