---
title: "Bitcoin hard-forks and replay attacks"
description: "Given that the fork in November might not have replay protection, you'll have to ensure you protect yourself before you transact any BTC."
date: "2017-09-25"
published: "2017-09-25T08:42:16.000-07:00"
slug: "what-to-do-before-a-blockchain-hard-fork"
tags: ["bitcoin"]
deadImages: []
---

Dealing with blockchain hard-forks seems to have become an unfortunate and time-consuming reality of working in the cryptocurrency space these days: all the cool kids seem to be doing it.

![Forking, the hard way.](/content/images/2017/09/forking-the-hard-way.png)

With the looming possibility of [yet another Bitcoin hard-fork](https://bitcoinmagazine.com/articles/segwit2x-and-case-strong-replay-protection-and-why-its-controversial/) come November, the rumor mill has started spitting out the much expected [fear-mongering articles](https://cointelegraph.com/news/november-segwit2x-hard-fork-could-see-newbie-users-lose-bitcoins).

Let me start by saying that if the hard-fork does happen, and your Bitcoin isn't stored in an exchange, **no immediate action will be required from you**. If you are currently hosting your Bitcoin is an exchange like Coinbase or Gemini, you are beholden to those companies to do the right thing when Bitcoin forks: allow you access to both currencies. It might not happen immediately; it might not happen at all.

If you have your Bitcoin in an offline wallet stored in a vault somewhere (as is recommended), and have no intentions of selling your newly cloned Bitcoin, then save this article for later.

The reason this is a no-op for any Bitcoin holders is the fact that the newly cloned blockchain is a copy of the old blockchain: anyone attempting to move your holdings will still need a valid signature from your private key. Inaction will not lead to loss of your holdings, period.

![Bitcoin network before and after a hard-fork. No biggie.](/content/images/2017/09/fork4.png)

However, given that the fork in November might not have replay protection, you'll have to ensure you protect yourself before you transact any Bitcoin.

#### What is a replay attack?

It turns out that if you fork two very similar code-bases with no protocol modifications, any message intended for a node running the new codebase is also valid for a node running the old codebase. A replay attack happens when a malicious node in one of the chains intentionally sends messages it receives to the other chain.

![Bitcoin network with a malicious attacker replaying messages on both chains.](/content/images/2017/09/fork3.png)

That brings us to the quickest solution that guarantees you don't lose access to any of your holdings in either chain: after the fork happens, ensure that **the first transaction you do is transferring all your holdings from your current wallet to another wallet under your control**. Doing this will make sure that, even if an attacker relays your transaction to the other chain, you're the sole person in control of the corresponding destination wallet address, thus reducing the impact of the attack to a minor annoyance.

Here is the list of actions to take after the fork:

1. Use your normal Bitcoin software[[1]](#fn1) to generate a new wallet and save it offline.
2. Bring your current Bitcoin wallet online, and transfer all your current holdings into the new wallet.
3. Verify that your Bitcoin has actually been sent (at least six confirmations on the blockchain).
4. Download trusted software that supports the new fork[[2]](#fn2).
5. Generate a new wallet using the new software, and save it offline.
6. Import your old wallet keys into this new software wallet, and send all the Bitcoin to your newly generated offline wallet.
7. Verify that your new currency has made it to the new wallet.

I hope this helps clear up some of the confusion around the hard-fork. Be safe out there.

---

1. I recommend you using [Electrum](https://electrum.org/) [↩︎](#fnref1)
2. There is unfortunately no software currently available for this. I'll keep you posted. [↩︎](#fnref2)
