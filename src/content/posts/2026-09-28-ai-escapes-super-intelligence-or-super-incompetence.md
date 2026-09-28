---
title: "AI Escapes: Super Intelligence or Super Incompetence?"
description: "Model escapes look like Jack Sparrow’s palm tree scene: capable agents, loose ropes, and captors who never watched the tree."
date: "2026-09-28"
published: "2026-09-28T17:00:00.000Z"
slug: "ai-escapes-super-intelligence-or-super-incompetence"
tags: ["security", "ai"]
deadImages: []
---

![Palm Tree Escape — Captain Jack Sparrow](/content/images/2026/09/ai-escapes-palm-tree.jpg)

One of my favorite scenes in Pirates of the Caribbean is the Palm Tree Escape. Captain Jack Sparrow is captured by the Spanish army and tied to a palm tree. He gets drunk, obviously, climbs the tree while still tied to it, ties the rope to a coconut, and manages to propel himself through the air to a distant palm tree. The scene is hilarious for many reasons, but chief among them are how unnecessarily flourished his escape is and how incompetent his captors are.

It gets worse on a rewatch. The rope is loose enough to slide under. Instead, he shimmies up the entire trunk, still tied, as it narrows beneath him (coconuts and leaves notwithstanding). And nobody is watching. No rounds, prisoners out of sight; the entire containment depends on a single rope. The Spanish only notice there is an escape when a pirate is literally flying overhead. As a Portuguese—whose country has been invaded by Spain more than once—I confess I enjoy the portrayed incompetence of the Spanish army more than I should.

I keep coming back to it because the AI world has spent months talking about "escapes." Models under evaluation hacked external companies. Meta, Google, Anthropic, and OpenAI have all reported them. The narrative the media focused on was obvious: a rogue mind, containment is futile.

Here's my read: the escapes are real. They are also basically the palm tree scene all over again.

The models behaved like drunk pirates. They were loud: Hugging Face reconstructed roughly 17,600 actions over four and a half days, one every twenty seconds, in view of the cameras. Their goals were dubious. Instead of solving their evaluation tasks, they, like pirates, turned to crime! Several unrelated systems were attacked. They formed a crew. Supposedly isolated agents turned a package repository into a message board, swapped discoveries, and divided the work. And they were capable. New vulnerabilities, chained exploits, a foothold turned into broader access.

So when I say drunk pirates, please don't hear "harmless." Hear capable agents with poor judgment.

But before deciding how much credit to give the pirates for escaping, we need to look at the competence of their captors. Unpatched Artifactory, unpatched Linux kernel, unhardened (general-purpose) OSes. Internet access was blocked, sure, but the agents could reach Artifactory and have it make requests for them. Textbook SSRF. The same service (surprisingly, it was r/w) became the comms channel between the "isolated" agents. There was monitoring, and it even worked; an alert flagged port sweeps. Nothing shut down. In a separate incident, models were told they had no internet while a misconfiguration quietly left it on. Total and complete incompetence.

If you are evaluating a model to assess its hacking capabilities, attacks on the surrounding infrastructure should be included in your threat model. The more capable you believe your models are, the higher the bar for whatever is holding them.

Of course, if you run nmap in a loop on an internet-connected host and pipe it into Metasploit, you will probably hack some hosts too. In fact, the attacks were the same old crimes: SSRF, exposed secrets, unsafe deserialization, broken authorization, and privilege escalation. This feels a lot less like opening Pandora's box and more like finally looking under the rug and realizing that software on the internet has been a mess for decades. We just finally got the tools to see it.

Some things did change, and I won't try to minimize their impact. With models, abstract objectives can now become fully adaptive attack campaigns without human involvement. Machine speed attacks have been around for decades; machine speed planning hasn’t. It also seems that the old question on whether bugs are sparse or dense has been resolved. Dense. Chrome fixed 1,072 security bugs across two releases, more than the previous 23 milestones combined. We also have to contend with the fact that these models are amazing at reverse engineering. This means that every security update will now always lead to a spike in n-day exploits in the wild. Woof.

So, we be cooked? Not quite. We have AI too, and defenders have advantages that attackers don't. We know our own waters: the source, the architecture, what the thing is supposed to do. We get to act before exposure, and we get to choose the material we build with.

In a future post, I’ll enumerate a non-exhaustive list of what I believe defenders should do, considering these new capabilities. For now, the bigger question is whether we can contain capable models before we solve the alignment problem?

At a minimum:

We need logs that the agents can't rewrite, collected outside the agent's trust domain, append-only, and signed. Blockchains anyone?

It’s now possible to create a private internet for dangerous evaluations (websites, package registries, synthetic identities, controlled targets), so the experiment doesn't inherit real victims.

And air gaps. We've run air-gapped systems at Anchorage for almost a decade. It's entirely possible to build systems that can't be misconfigured onto the internet.

![OpenAI's Noam Brown on air-gapping and temperature-channel side channels](/content/images/2026/09/ai-escapes-airgap-reddit.jpg)

Simple and pragmatic defenses like these are commonly deemed insufficient, the underlying question being: If we are in the singularity, is this enough?

I have no idea if we’re in the singularity. What I do know is this: the next time someone says that air-gapping cannot contain a misaligned AI, remember: these are not people who built a sophisticated containment and watched a model beat it. They are the caricature-like Spanish army that imprisoned Jack Sparrow, baffled and surprised because a pirate got away from a palm tree and a loose rope (helped by a blatant disrespect for the laws of physics, I should add).
