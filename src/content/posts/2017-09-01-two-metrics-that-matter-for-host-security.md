---
title: "The two metrics that matter for host security"
description: "The rise of the two metrics that matter for host security: reverse uptime and golden image freshness."
date: "2017-09-01"
published: "2017-08-31T18:34:08.000-07:00"
slug: "two-metrics-that-matter-for-host-security"
tags: []
deadImages: []
---

![It's the final countdown.](/content/images/2017/08/usertimer.gif)

As companies move their infrastructures towards ephemeral microservices, there is an opportunity to rethink some of the security metrics typically used to track infrastructure risk, such as the number of currently unpatched vulnerabilities sorted by their criticality.

In the same way that the adoption of Continuous Integration and Continuous Delivery (CI/CD) allows faster development and patching of application vulnerabilities, it is time for organizations to realize that they should follow the same pattern around upgrading the Operating System their applications are running on.

Instead of having a JIRA queue—with an ever-increasing number of tickets tracking the CVEs in the Linux Kernel—we should instead start tracking reverse uptime and golden image freshness.

## The two metrics that matter for host security [[1]](#fn1)

The first metric I want to mention is **reverse uptime**, which is a catchy name for a straightforward concept:

> Instead of looking at the time a host has been online as a proxy indicator of stability, we instead look at it as a proxy indicator of risk.

A company that tracks reverse uptime as a security metric will relentlessly focus on bringing down the average uptime by automatically reimaging whichever hosts have been online the longest, and therefore, lowering risk.

![Re-image from golden image](/content/images/2017/08/Blog-Post-Drawings.png)

Of course, re-imaging all hosts from an out-of-date image is not ideal. This brings us to our second metric, **golden image freshness**:

> The time elapsed since the last build of the canonical OS image used to bootstrap hosts.

Here are the main reasons to track these two metrics:

- OS Drift is a common cause of downtime. Reimaging hosts reduces unexpected divergences in configuration.
- It becomes significantly harder to backdoor or maintain persistence on compromised nodes, since it forces the attacker to go after components like the firmware.
- Updating the kernel is no longer an issue, since updating the golden image ensures hosts will be upgraded within a time-bounded window.
- The golden image is now the single point of control, making it easier to audit, scan, sign and verify what is running on the hosts.

Continuously driving down both reverse uptime and golden image freshness will significantly reduce the risk posed by the most dangerous type of vulnerability there is: **old-days**.

## The rise of OS rolling-deploys

Of course, tracking reverse uptime is a lot easier if you have an infrastructure where you can do hitless OS rolling deploys. But that, dear reader, is precisely the point. Caring about reverse uptime will ensure that your IT organization will get to the point where your oldest host has been online for hours, not years.

![Rolling deploy from golden image](/content/images/2017/08/Screen-Shot-2017-08-30-at-3.15.06-PM.png)

The good news is that there are several projects out there that will make it easier to automate this process. Projects like [Terraform](https://www.terraform.io/) and [infraKit](https://github.com/docker/infrakit) allow you to safely and predictably change your production infrastructure. Projects like [Packer](https://www.packer.io/) and [linuxKit](https://github.com/linuxkit/linuxkit) allow you to rebuild your OS images continuously.

## Conclusion

With the rise in popularity of tools like [linuxkit](https://github.com/linuxkit/linuxkit) for OS image building and [infrakit](https://github.com/docker/infrakit) for automated infrastructure rolling-deploys, refreshing every host in your infrastructure on a regular basis is no longer a pipe-dream—making reverse uptime and golden image freshness the two most important security metrics to track for host security.

Thanks to [Dino Dai Zovi](https://twitter.com/dinodaizovi) for pushing me to put this down in writing and [Nathan McCauley](https://twitter.com/nathanmccauley) for the review.

---

1. Sorry for the clickbaity title :) [↩︎](#fnref1)
