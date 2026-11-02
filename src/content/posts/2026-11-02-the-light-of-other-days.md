---
title: "The light of other days"
description: "In The Light of Other Days, Arthur C. Clarke imagines a world in which wormhole technology lets anyone spy on anyone."
date: "2026-11-02"
published: "2026-11-02T17:00:00.000Z"
slug: "the-light-of-other-days"
tags: ["security", "ai"]
deadImages: []
---

In [*The Light of Other Days*](https://en.wikipedia.org/wiki/The_Light_Of_Other_Days), Arthur C. Clarke imagines a world in which wormhole technology lets anyone spy on anyone. Privacy disappears, forcing society to completely reshape its institutions to limit the harm of exposed secrets.

We haven’t invented wormhole technology yet, but AI and quantum computing are raising parallel questions: how do we adapt our institutions when technologies advance beyond our ability to keep secrets?

A particularly relevant kind of secret in my space is the private key. There’s the possible future threat to the cryptography most digital assets rely on, and there’s the incessant drumbeat of vulnerabilities in software that runs everywhere. AI will help accelerate both. Then add a persistent attacker: North Korea, which runs a sophisticated operation against the exchanges, custodians, and other infrastructure providers we rely on to keep our secrets (and therefore assets) safe.

Last week, Binance, the world’s largest exchange, was hacked for about $6.3 billion, [according to its own announcement](https://www.binance.com/en/support/announcement/detail/c5a8729a97ac486d963784d96c5642d7). This is the biggest cryptocurrency theft on record (and in fact [may be the biggest theft of any kind](https://www.elliptic.co/insights/binance-largest-hack-in-history/) in recorded history, full stop). It’s also a clear data point: the magnitude of the potential downside from these technologies is accelerating. Our fears about the foundations of modern security may come true sooner than we’d like.

<div class="shot-row">

![Bar chart of the biggest crypto hacks: Binance's $6.3B in 2026 is about four times Bybit's $1.5B in 2025](/content/images/2026/11/biggest-crypto-hacks.png)

![Scatter plot of crypto hacks over time, with dot size proportional to the amount stolen](/content/images/2026/11/crypto-hacks-over-time.png)

</div>

At the same time, we need to contextualize the threat. Yes, AI and quantum technologies are advancing more rapidly than ever, and could pose very significant risks to long-held beliefs about security. But, ironically, what Binance experienced was a very sophisticated version of attacks that have been around for a decade.

Of course, media coverage quickly tried to find the AI hook. A [Yahoo Finance segment](https://finance.yahoo.com/video/how-hackers-allegedly-used-ai-to-hide-a-63b-binance-heist-162338122.html) discussed how the hackers “allegedly used AI” to hide the theft.

But no published evidence shows AI was used in the breach.

My read is that no AI was used here, and none was needed. Binance identified a [compromised DevOps engineer’s laptop](https://www.bleepingcomputer.com/news/security/binance-links-63-billion-crypto-theft-to-compromised-devops-laptop/) that gave the attacker access to the service containers that submit withdrawals. It said it had seen no evidence that wallet private keys leaked. Co-CEO Richard Teng later said the investigation had found [“additional points of breach,”](https://www.coindesk.com/tech/2026/10/30/binance-uncovers-wider-breach-in-usd6-3-billion-exploit-targets-sunday-withdrawal-restart) and that “the attacker did not simply use one engineer’s permissions.”

Sooner or later, though, attackers will use AI, and I expect the next record to be set with it.

The relevance of AI in our threat landscape is that it radically changes the cost of finding weaknesses, and the speed at which they can be exploited.

On October 21, PHP shipped fixes for the two PHP2Shell bugs, which allowed unauthenticated remote code execution. By [Wiz’s count](https://www.wiz.io/blog/php2shell-php-rce) PHP runs about 70% of websites. Three teams found PHP2Shell independently: Calif, Wiz and [OpenAI](https://openai.com/index/coordinated-disclosure-of-critical-vulnerabilities), all using frontier models. Wiz says a single researcher did in a week what used to take a world-class team months.

[Amazon saw an exploit attempt](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-identifies-php2shell-exploitation-prior-to-public-disclosure-in-madpot/) on October 17, four days before disclosure. [Delft’s honeypots](https://php2shell.delftintellab.com/) recorded shell commands 35 minutes before the patch shipped.

Put a vulnerable host on the internet and someone will be trying to hack you with it within hours. Maybe even minutes.

Amazon’s threat intelligence team put it this way: “A 7-day or 30-day SLA assumes a delay that no longer exists.”

![A balance scale tipped toward attackers, with defenders catching up slowly](/content/images/2026/11/security-is-a-balance.png)

Security is a balance, and right now the balance favors attackers. Finding a weakness is getting cheaper. Fixing one still means testing a change, scheduling deployment and reaching every affected machine. I expect this to continue to be true for the next 12 to 18 months. We live in a scary time.

That said, defenders get access to the exact same models. PHP2Shell itself was found by researchers using frontier models, and it was rapidly disclosed and fixed. We, the defenders, also start with advantages attackers don’t have. We have our source code and know the architecture, and we can shrink what’s exposed before an attacker finds it.

I expect defense to catch up. That takes investment and changes to how we operate. It won’t happen simply because the models improve.

For the next 12 to 18 months, I’d keep patching but stop depending on winning that race. The first investment is getting tested changes deployed faster. Measure how long a tested fix takes to reach every affected machine. Automate the rollout and test rollback. Make that the normal deployment process, so an urgent patch doesn’t need a new procedure.

I’d also stop storing cloud keys. Use federated workforce and workload identity, with short-lived tokens kept only in memory. Where possible, use mTLS with hardware-bound private keys. Attackers now capture unbound credentials, even short-lived ones.

Then add boundaries. Remove direct administrative access from laptops to production. Give withdrawal authorization its own controls. The attack path should be blocked by at least one boundary at all times. Check that the credentials used to deploy a service cannot also change who approves withdrawals. If you’re really serious about security, change everyone’s laptops to Chromebooks.

![Three changes defenders should make now: faster fixes, unstealable keys and boundaries between laptops, production and withdrawals](/content/images/2026/11/defenders-should-do-now.png)

Alas, as I sit here writing, I can’t help being skeptical about the large majority of organizations being able to catch up in time. I’m not concerned about the top organizations that hoard all the security talent, but about the 99% of other organizations that spent the past decades asking people for passports, selfies, addresses and bank statements to open accounts. Exchanges and banks hold them. So do fintech companies and the third-party KYC vendors they hire. Binance’s own [2019 KYC leak](https://www.binance.com/en/blog/all/update--action-response-thirdparty-vendor-kyc-matter-371631019142385664) traced back to images a vendor had handled in 2017 and 2018.

We should have collected less, deleted what we no longer need, and kept careful accounting of the copies held by vendors. Every copy that stays on file makes someone else’s privacy depend on one more system staying secure.

I’m usually an optimistic person, but if I’m right about the next 12 to 18 months, with attackers well ahead of defenders, I don’t see how all of the data collected by the 99% doesn’t see the light of day. And I really mean *all of it*.

In *The Light of Other Days*, people have to learn to live after privacy ends. I worry about how close we’re getting to it. We have already spent decades recording the past. Now we have to keep it from becoming public.
