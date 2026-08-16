---
title: "Crypto Anchors: Exfiltration Resistant Infrastructure"
description: "We need to start architecting our data-flows in a way that makes it harder for attackers to continue exfiltrating sensitive data our of our infrastructures"
date: "2017-10-08"
published: "2017-10-08T15:31:47.000-07:00"
slug: "crypto-anchors-exfiltration-resistant-infrastructure"
tags: ["crypto-anchors", "infosec"]
deadImages: []
---

I've been thinking about a concept that [Nathan McCauley](https://twitter.com/nathanmccauley) and I came up with a few years ago: [crypto-anchoring](https://www.youtube.com/watch?v=lrGbK6fE7bI&ref=blog.diogomonica.com)—and how much impact this kind of architectural decision could have in the breaches that we've been [experiencing lately](http://fortune.com/2017/10/02/equifax-credit-breach-total/).

![](/content/images/2017/10/crypto-anchor.png)

It turns out that the vast majority of data breaches follow a pattern like this:

- An attacker hacks into company X's infrastructure.
- The attacker exfiltrates sensitive content (hashed passwords, etc.).
- The attacker has fun with the data at home (password cracking, etc.).

And even though there are thousands of different security products focused on detecting each step of the [attacker killchain](http://www.techrepublic.com/article/cybersecurity-understanding-the-attack-kill-chain-and-adversary-ecosystem/), it's time that we start architecting our applications—and data-flows—in a way that makes it harder for attackers to continue following the same script.

## Canonical Attack

Take the simplified example of a [data-exfiltration attack](https://latesthackingnews.com/2016/12/15/1-billion-accounts-leaked-yahoos-database/) depicted below:

![Canonical database leak attack.](/content/images/2017/10/common-database-exfil-1.png)

In this particular example, an attacker accesses and exfiltrates the contents of the user database containing all of the user information, including the password hashes used for authentication to the service. The attacker is now free to crack these passwords anywhere, and if the attack and exfiltration of the database aren't immediately detected, you might never know what happened until the cracked passwords start being sold on the black market.

## Slowing attackers down

What if we could architect our systems such that the attacker can't use the stolen data outside of our infrastructure? Doing that would give us the following advantages:

- More chances for detection of the attackers, since they have to operate within our environment.
- Logs that show precisely what pieces of data have been accessed, allowing us to assess the impact an attack more accurately.
- Force the attacker work in an adversarial environment, slowing down their progression by rate-limiting services that allow access to sensitive data.

By forcing the attacker to have to operate within our infrastructure, we are making them operate like a **bull in a china-shop**.

![](/content/images/2017/10/bull-in-china-shop-1.jpg)

## Keeping attackers in

Let's look again at the example of our canonical database leak. If we want to force an attacker not to be able to crack a password offline, we have to make the computation of the password hash dependent on something that can't leave the data center. Maybe a key generated inside of a piece of hardware physically bolted onto your servers?

It turns out those already exist, and are called [HSMs](https://en.wikipedia.org/wiki/Hardware_security_module) (Hardware Security Modules). You can buy your own HSMs if you’re running your own datacenter, or use the ones available in various [cloud providers](https://azure.microsoft.com/en-us/services/key-vault/).

Let's take the same attack as before, but instead of simply hashing the password (`H(password)`) we first apply an operation using a key generated inside of our HSM (`HMAC(key, password`). Adding this extra step makes the contents of the database the attacker exfiltrates contain hashes of passwords that can't be re-computed without the ability to query the HSM.

![Crypto-anchored User Password Access.](/content/images/2017/10/anchored-database-exfil-1.png)

That brings us to the concept of a crypto-anchor:

> A Crypto-anchor is a service that forces a data-flow to only be available within the boundaries of your infrastructure.

Let's take a look at a couple more examples of using crypto-anchors:

**Data-flow**: You have a credit-card processing service that needs the ability to temporarily persist and later decrypt end-to-end encrypted credit-card data coming from a remote hardware device.

**No Crypto-Anchor**

The most straightforward way of implementing this data-flow is by giving the payments service access to the private-key that decrypts the transaction information coming from the remote credit-card reader. This has the obvious downside that an attacker that compromises the payments service can exfiltrate both the encrypted transactions *and* the private-key that is necessary to decrypt them.

![](/content/images/2017/10/searle-no-hsm-1.png)

**With Crypto-Anchor**

If instead we crypto-anchor this data-flow, we disallow the attacker from decrypting any of these transactions outside of our infrastructure.

The easiest way of doing this is to have the private key necessary for decryption stored inside an HSM, exposed behind a decryption service with strict per-service rate-limiting on the number of allowed decryptions.

![](/content/images/2017/10/searle-hsm-1.png)

**Data-flow**: You need a tokenization system that creates a stable identifier corresponding to a specific piece of sensitive data, say a user's Social Security Number[[1]](#fn1).

**No Crypto-Anchor**

The obvious way to implement a tokenization service is to generate a random token and store a mapping of that token and a one-way hash of the sensitive piece of data.

Unfortunately, the maximum number of possible SSNs is just under 1 billion, making it trivial for an attacker that downloads the database to brute-force them offline.

![](/content/images/2017/10/fidelius-2.png)

**With Crypto-Anchor**

Similarly to the previous example, if you wanted to ensure the attacker couldn't brute-force the SSNs offline, you could add a crypto-anchor in the data-flow, turning the offline brute-force attack into an online attack.

The easiest way to accomplish this is to have the token generation process be a keyed one-way function, that can only happen inside of an HSM.

![](/content/images/2017/10/fidelius-with-tokenization-1.png)

If we generalize the examples above, we can easily see that when we're architecting a system that deals with sensitive data, we should make sure to:

- Never expose a service that stores sensitive data directly to any internet-exposed (front-end) services.
- Split core functionality into independent services, allowing for natural crypto-anchoring points in your data flow
- Categorize services with different levels of security into different security zones, and rate-limit the number of API calls to the crypto-anchor on a per-zone or per-service basis.

## Conclusion

By designing your applications in a way that ensures sensitive data-flows are crypto-anchored to your data center, you are:

- Slowing attackers down.
- Gathering better information on what data was exposed.
- Making attackers continuously risk detection by forcing them to operate on your turf.

So go out there and anchor your data! ⚓️

---

1. Equifax anyone? [↩︎](#fnref1)
