---
title: "How to get your GrokBot to receive emails instantly"
description: "Wake a GrokBot on inbound mail with a webhook, a cheap Replit proxy, and a fetch of that one email."
date: "2026-08-28"
published: "2026-08-29T01:30:00.000Z"
slug: "how-to-get-your-grokbot-to-receive-emails-instantly"
tags: ["security"]
deadImages: []
---

One of the most useful use cases for me is Todoist and email triage. I have a TriageBot that works on cleaning up my inbox in the morning.

Unfortunately, there are some emails that I want to act on immediately. Scheduling a meeting, for example: no reason to wait. Scheduled routines don't work for that. You're not going to have the bot waste tokens by waking up every minute.

Here is how I solved this issue.

GrokBot already has the interesting primitive. A routine can fire with a webhook URL. Anything that can hit the URL with the secret can start work out of band.

<div class="shot-row">

![GrokBot add webhook menu with Webhook highlighted](/content/images/2026/08/grokbot-add-webhook-menu.png)

![GrokBot webhook POST URL and redacted key](/content/images/2026/08/grokbot-webhook-details.png)

</div>

Unfortunately, even though Resend agentic mail can call webhooks, you can't connect it to GrokBot directly: it doesn't support passing secret keys on webhooks. And even if it did, I don't necessarily want all emails going to GrokBot. Oh, and there is the prompt injection issue: generally a bad idea to have all untrusted inbound email being fed directly into something that has permissions to send email.

![Resend Add webhook modal with email.received selected](/content/images/2026/08/resend-add-webhook.png)

## Vibecode a proxy, then fetch

So I vibecoded a tiny proxy on Replit. Secrets live in env vars. It does two things: drop, or forward.

I keep the proxy boring:

1. Verify the Resend signature. If you cannot prove the event, drop it.

2. Require `email.received` and an `email_id`. Wrong shape, drop it.

3. Allowlist destination addresses. Unknown `to`, drop it. Do this before you look at the body. You do not have the body yet anyway.

4. Scan subject and metadata for the usual injection tells: "ignore previous instructions", fake system prompts, jailbreak paste. Drop those. Do not try to be clever. You will miss some. That is fine. The goal is to stop the free ones.

5. Forward metadata only, with the GrokBot sender secret in the header or query the routine panel gave you.

Put the GrokBot secret, the Resend signing secret, and the destination allowlist in Replit env vars. Do not bake them into the repo.

The routine that wakes is dumb on purpose. It uses the Resend connector to fetch that one email and its attachments, then acts. The untrusted text arrives after the cheap filters, and it arrives one message at a time.

![Resend to Replit proxy to GrokBot](/content/images/2026/08/grokbot-resend-proxy.png)

GrokBot gets notified and acts on every email you actually wanted, instead of chewing a bulk schedule.

That is the whole trick.
