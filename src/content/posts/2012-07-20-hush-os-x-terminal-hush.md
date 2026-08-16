---
title: "Hush OS X Terminal, hush"
description: "I've been noticing for a while a huge delay when opening new tabs on iTerm (or terminal.app). This would range from 3 to 7 seconds when opening a new tab. It was driving me nuts."
date: "2012-07-20"
published: "2012-07-20T14:45:00.000-07:00"
slug: "hush-os-x-terminal-hush"
tags: ["terminal", "macOS"]
deadImages: []
---

I've been noticing for a while a huge delay when opening new tabs and windows on iTerm (or terminal.app). This would range from 3 to 7 seconds when opening a new tab. It was driving me nuts.

## Log craziness

Turns out that for whatever reason *login -fp username* (the command that is executed when we open a new terminal), goes to the asl log directory and goes crazy reading all the files. Quick fix:

```console
# sudo rm -rf /private/var/log/asl/*.asl
```

**Note:** By doing this you are effectively deleting (potentially useful) logs from your system. If this is your company issued laptop you might want to talk with your IT/Infosec crowd before doing it ;)

## Too much environment crap

Also, to avoid the terminal from fetching a bunch of stuff every-time you open a new session (previous login session, motd, system messages, etc), I enabled [hushlogin](http://developer.apple.com/library/mac/#documentation/Darwin/Reference/ManPages/man1/login.1.html):

```console
# touch ~/.hushlogin
```

## Too much user crap

I also went through my *~/.bash_profile* and removed all the stuff that I no longer needed. Don't underestimate the impact that those utilities that show you which git branch you are currently on have in your terminal load time.

## SSH connection reuse

If you, like me, spend most of your day accessing a multitude of different hosts using ssh, you might also find useful to enable connection reuse in your ssh config.

To enable connection reuse you need to create a folder where SSH will keep track of established connections:

```console
# mkdir ~/.ssh/tmp
```

and add the following two lines to **the top** of your ssh config (~/.ssh/config):

```console
ControlMaster auto
ControlPath   /Users/USERNAME/.ssh/tmp/%h_%p_%r
```

I hope these small tricks save you as much time as they have saved me.
