---
title: "The dangers of pastebin-like websites"
description: "Services like pastebin.com are useful for sharing and discussing code. However, people trust the generated URLs to be unknown to anyone else, other than the people we want to share them with."
date: "2011-05-07"
published: "2011-05-07T15:05:00.000-07:00"
slug: "the-dangers-of-pastebin-like-websites"
tags: []
deadImages: ["https://posterous.com/getfile/files.posterous.com/temp-2010-12-28/EwCIAuEGemxqAgHsjFJyHjwFkaGHoeqcussDyFDhncinqGtwJHCoinqElcIq/Picture_3.png.scaled500.png"]
---

Services like pastebin.com are useful for sharing and discussing code. However, people trust the generated URLs to be unknown to anyone else, other than the people we want to share them with. This false sense of security brings us to this post: sensitive information being shared with the world, unintentionally.

There are several ways your pastebin share can be accessed by someone else. First, these sites usually have a search function. With this, we can quickly filter the most interesting shares. Also, another common feature is the "latest shared", which brings to the front-page your pastebin, for everyone to see. Finally, even if these features are not present on the particular service you use, the algorithms for URL generation are simply not secure. They are too predictable, and easy to brute-force.

So, lets try something really quick to see what we can find out. I google "password site:pastebin.com" (the most obvious keyword. ever.), and it returns 19.000 results. Nice. Lets look at result #6, for example: [http://pastebin.com/HxFcAe7f](http://pastebin.com/HxFcAe7f) .

This appears to be code for a simple voting system, written in PHP. Wait, what is this on lines 1-3?!

```php
$user="mushonov";
$password="123456";
$database="logon"; //Char+login DB
```

Not only the author shares with the world the username and password, but also shares the structure of the database being used (lines 41 and 45).

Then you say: "But this information is useless. We don't know which website this paste refers too. Surely that information is not present in there, right?". Wrong! :

```html
form style='text-align: center;' method='post' 
action='https://www.molten-wow.com/'
```

Accessing the website we notice that it has a private area for registered users... Will the same username/password combination give us a local account? Nah, too easy. Oh wait...

![Oops](https://posterous.com/getfile/files.posterous.com/temp-2010-12-28/EwCIAuEGemxqAgHsjFJyHjwFkaGHoeqcussDyFDhncinqGtwJHCoinqElcIq/Picture_3.png.scaled500.png)

So in less than one minute we have the website URL, the username/password of the database, we know the structure of the database, we have a user account which is likely owned by one of the website administrators and a piece of hand-made PHP code, which is a very good place start to find vulnerabilities. This website is asking to be pwned.

Conclusion: if you need to share code with the world (because you are asking for help, for example), at least go to the trouble of removing the sensitive information present in there.
