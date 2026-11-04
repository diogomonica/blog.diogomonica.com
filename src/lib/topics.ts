/**
 * Topic clusters for the security hub page. Membership is by slug so the
 * visible post tags stay as they are. Each post appears in one cluster.
 */
export type TopicCluster = { id: string; name: string; blurb: string; slugs: string[] };

export const SECURITY_TOPIC = {
  path: "/topics/security/",
  title: "Security essays",
  description:
    "Essays on security engineering by Diogo Mónica: AI security, key management and crypto custody, infrastructure and container security, and network security research.",
};

export const SECURITY_CLUSTERS: TopicCluster[] = [
  {
    id: "ai-security",
    name: "AI security",
    blurb: "What AI changes for attackers and defenders, and how to contain AI agents.",
    slugs: [
      "the-light-of-other-days",
      "ai-escapes-super-intelligence-or-super-incompetence",
      "how-to-get-your-grokbot-to-receive-emails-instantly",
    ],
  },
  {
    id: "cryptography",
    name: "Applied cryptography, keys and custody",
    blurb: "Hardware-backed secrets, password hashing and protecting keys and coins.",
    slugs: [
      "crypto-anchors-exfiltration-resistant-infrastructure",
      "why-should-hard-be-secure-enough-information-and-non-invertibility-2",
      "what-to-do-before-a-blockchain-hard-fork",
      "password-security-why-the-horse-battery-staple-is-not-correct",
      "its-not-just-the-salt-stupid",
    ],
  },
  {
    id: "infrastructure",
    name: "Infrastructure and application security",
    blurb: "Immutable hosts, secrets delivery, certificate rotation and browser security headers.",
    slugs: [
      "two-metrics-that-matter-for-host-security",
      "why-you-shouldnt-use-env-variables-for-secret-data",
      "hitless-tls-certificate-rotation-in-go",
      "increasing-attacker-cost-using-immutable-infrastructure",
      "creating-a-csp-policy-from-scratch",
      "from-double-f-to-double-a",
    ],
  },
  {
    id: "network",
    name: "Network and offensive security research",
    blurb: "Early notes from network security research: sniffing, session hijacking and privilege escalation.",
    slugs: [
      "weird-packet-of-the-day",
      "exploit-suggester",
      "the-dangers-of-pastebin-like-websites",
      "facebook-sidejacking",
      "sniffing-in-monitor-mode-with-airport",
      "poor-mans-ssh-keylogger",
      "packet-inter-arrival-time-with-scapy",
      "monitor-vs-promiscuous",
      "change-your-mac-with-py-mactool",
    ],
  },
];

const CLUSTER_BY_SLUG = new Map(
  SECURITY_CLUSTERS.flatMap((cluster) => cluster.slugs.map((slug) => [slug, cluster] as const)),
);

export function securityClusterFor(slug: string): TopicCluster | undefined {
  return CLUSTER_BY_SLUG.get(slug);
}

/** Up to `count` other posts from the same cluster, in cluster order. */
export function relatedSlugs(slug: string, count = 3): string[] {
  const cluster = CLUSTER_BY_SLUG.get(slug);
  if (!cluster) return [];
  return cluster.slugs.filter((s) => s !== slug).slice(0, count);
}
