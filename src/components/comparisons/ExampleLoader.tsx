import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Full example comparison data with author preference at top
const EXAMPLE_COMPARISON = {
  meta: {
    title: "ePBS vs 6-Second Slots: Glamsterdam's Consensus Layer Fork Choice",
    author: "Jason J McPheron (jmcpheron.eth @jmcpheron)",
    created: "2025-01-26",
    description: "Comparing EIP-7732 (Enshrined PBS) and EIP-7782 (6-Second Slots) for the single consensus-layer headline slot in Glamsterdam"
  },
  eips: [7732, 7782],
  sections: [
    {
      type: "fork-context",
      fork: "Glamsterdam",
      headlinerStatus: {
        "7732": {
          status: "Headliner Candidate",
          layer: "CL",
          discussionLink: "https://ethereum-magicians.org/t/eip-7732-enshrined-proposer-builder-separation-epbs/19634"
        },
        "7782": {
          status: "Headliner Candidate", 
          layer: "CL",
          discussionLink: "https://ethereum-magicians.org/t/reducing-slot-time-to-6s/21303"
        }
      },
      constraint: "Only one consensus-layer headliner will be included in Glamsterdam"
    },
    {
      type: "author-preference",
      preferredEip: 7732,
      strength: "strong",
      reasoning: "While both proposals have merit, I strongly prefer ePBS. The relay oligopoly represents a clear and present danger to Ethereum's credible neutrality that grows worse every month we delay. The free option problem, while real, is overstated - practical constraints like builder-searcher relationships, reputation systems, and the visibility of revealed payloads make it difficult to exploit profitably. We can further mitigate risks with asymmetric payments and shorter reveal windows. In contrast, 6-second slots offer a nice UX improvement but can be implemented in any future fork. We shouldn't let theoretical game theory concerns kill a critical decentralization upgrade when the alternative is continued relay dominance."
    },
    {
      type: "header",
      content: "Executive Summary"
    },
    {
      type: "quick-stats",
      stats: {
        "7732": [
          { icon: "🔐", label: "Trust Model", value: "Removes MEV relay dependency" },
          { icon: "⚠️", label: "Key Risk", value: "Free option (manageable)", color: "yellow" },
          { icon: "🔧", label: "Complexity", value: "High - new roles & auction", color: "red" },
          { icon: "⏱️", label: "Urgency", value: "High - relay centralization growing", color: "yellow" }
        ],
        "7782": [
          { icon: "⚡", label: "User Benefit", value: "2x faster confirmations" },
          { icon: "📡", label: "Key Risk", value: "Slow validator strain", color: "yellow" },
          { icon: "🔧", label: "Complexity", value: "Medium - timing refactor", color: "yellow" },
          { icon: "⏱️", label: "Urgency", value: "Low - can add later", color: "green" }
        ]
      }
    },
    {
      type: "northstar-comparison",
      northStars: ["Scale L1", "Scale blobs", "Improve UX"],
      alignment: {
        "7732": {
          "Scale L1": {
            impact: "High",
            icon: "🟢",
            description: "Removes relay bottleneck, enables future danksharding slot structure"
          },
          "Scale blobs": {
            impact: "Medium",
            icon: "🟡",
            description: "Sets foundation for larger blob windows in future upgrades"
          },
          "Improve UX": {
            impact: "Low",
            icon: "🔴",
            description: "Mostly invisible to users, risk of empty blocks during volatility"
          }
        },
        "7782": {
          "Scale L1": {
            impact: "Low",
            icon: "🔴",
            description: "Doesn't increase throughput, only reduces latency"
          },
          "Scale blobs": {
            impact: "Low",
            icon: "🔴",
            description: "No direct impact on blob capacity or propagation"
          },
          "Improve UX": {
            impact: "High",
            icon: "🟢",
            description: "Halves confirmation time, makes dApps feel snappier, improves L2 settlement"
          }
        }
      }
    },
    {
      type: "stakeholder-impacts",
      stakeholders: ["endUsers", "appDevs", "walletDevs", "toolingInfra", "layer2s", "stakersNodes", "clClients", "elClients"],
      impacts: {
        "7732": {
          endUsers: {
            impact: "Low",
            icon: "😐",
            description: "No visible change except potentially fewer censorship issues long-term"
          },
          appDevs: {
            impact: "Medium",
            icon: "🔄",
            description: "Can rely on protocol-level MEV distribution instead of relay APIs"
          },
          walletDevs: {
            impact: "Low",
            icon: "😐",
            description: "Minor changes to builder preferences, mostly transparent"
          },
          toolingInfra: {
            impact: "High",
            icon: "🚨",
            description: "MEV relay infrastructure becomes obsolete, new PBS monitoring needed"
          },
          layer2s: {
            impact: "Medium",
            icon: "📈",
            description: "More reliable L1 inclusion without relay dependencies"
          },
          stakersNodes: {
            impact: "High",
            icon: "🔧",
            description: "Must adapt to new block proposal flow with builder commitments"
          },
          clClients: {
            impact: "High",
            icon: "🚨",
            description: "Major implementation: PTC logic, builder registry, auction mechanism"
          },
          elClients: {
            impact: "Medium",
            icon: "⚡",
            description: "Support blinded block production and builder communication"
          }
        },
        "7782": {
          endUsers: {
            impact: "High",
            icon: "🎉",
            description: "Transactions confirm in ~6s instead of 12s, dramatically better UX"
          },
          appDevs: {
            impact: "Medium",
            icon: "⚡",
            description: "Can design more responsive dApps with faster finality assumptions"
          },
          walletDevs: {
            impact: "Medium",
            icon: "📱",
            description: "Update confirmation UIs and timing expectations"
          },
          toolingInfra: {
            impact: "Medium",
            icon: "🔄",
            description: "Adjust monitoring intervals, API polling rates, analytics"
          },
          layer2s: {
            impact: "High",
            icon: "🚀",
            description: "Faster L1 settlement enables quicker cross-rollup interactions"
          },
          stakersNodes: {
            impact: "High",
            icon: "⚠️",
            description: "Tighter timing requirements, may stress slower home validators"
          },
          clClients: {
            impact: "High",
            icon: "🔧",
            description: "Optimize all timing loops, attestation aggregation, p2p propagation"
          },
          elClients: {
            impact: "High",
            icon: "🔧",
            description: "Faster state transitions, optimize execution paths"
          }
        }
      }
    },
    {
      type: "benefits-tradeoffs",
      data: {
        "7732": {
          benefits: [
            { text: "Eliminates trusted relay dependency", icon: "✅" },
            { text: "Protocol-enshrined MEV fairness", icon: "✅" },
            { text: "Enables future danksharding architecture", icon: "✅" },
            { text: "Reduces censorship via market competition", icon: "✅" }
          ],
          tradeoffs: [
            { text: "Builder free option exists but constrained by relationships", severity: "medium", icon: "⚠️" },
            { text: "Complex implementation across all clients", severity: "high", icon: "⚠️" },
            { text: "Risk of empty blocks during volatility", severity: "medium", icon: "⚠️" },
            { text: "New attack vectors via PTC manipulation", severity: "medium", icon: "⚠️" }
          ]
        },
        "7782": {
          benefits: [
            { text: "2x faster transaction confirmations", icon: "✅" },
            { text: "Better UX for all Ethereum users", icon: "✅" },
            { text: "Faster L2 settlement and bridging", icon: "✅" },
            { text: "Can be reverted if issues arise", icon: "✅" }
          ],
          tradeoffs: [
            { text: "May exclude slow home validators", severity: "medium", icon: "⚠️" },
            { text: "Increased p2p bandwidth requirements", severity: "low", icon: "⚠️" },
            { text: "Higher risk of reorgs initially", severity: "medium", icon: "⚠️" },
            { text: "Doesn't address MEV or scaling", severity: "low", icon: "⚠️" }
          ]
        }
      }
    },
    {
      type: "header",
      content: "Risk Deep Dive",
      level: 2
    },
    {
      type: "risk-analysis",
      risks: [
        {
          eip: 7732,
          risk: "Builder Free Option",
          severity: 45,
          mitigation: "Builder reputation, searcher relationships, asymmetric payments, revealed payload visibility",
          monetaryValue: "$100-300 theoretical, but hard to capture in practice"
        },
        {
          eip: 7732,
          risk: "Implementation Complexity", 
          severity: 60,
          mitigation: "Extensive devnet testing, phased rollout, circuit breakers"
        },
        {
          eip: 7782,
          risk: "Validator Participation Drop",
          severity: 40,
          mitigation: "Client optimizations, grace period, monitoring dashboards"
        },
        {
          eip: 7782,
          risk: "Network Instability",
          severity: 30,
          mitigation: "Can revert timing constants in emergency hard fork"
        }
      ]
    },
    {
      type: "timeline-comparison",
      timelines: {
        "7732": [
          { time: "0s", event: "Proposer broadcasts beacon block", icon: "📦" },
          { time: "3s", event: "Builder commits to payload", icon: "🔒" },
          { time: "3-9s", event: "Builder holds 'free option'", icon: "🎰", highlight: true },
          { time: "9s", event: "Builder reveals or forfeits", icon: "💸" },
          { time: "11s", event: "PTC votes on timeliness", icon: "✅" }
        ],
        "7782": [
          { time: "0s", event: "Block proposed", icon: "📦" },
          { time: "2s", event: "Block propagated (tight!)", icon: "📡", highlight: true },
          { time: "3s", event: "Attestation deadline", icon: "⏰", highlight: true },
          { time: "4s", event: "Aggregate signatures", icon: "✍️" },
          { time: "6s", event: "Next slot begins", icon: "⏭️" }
        ]
      }
    },
    {
      type: "debate",
      topic: "Is the free option problem a dealbreaker for ePBS?",
      perspectives: [
        {
          label: "The free option is a serious risk",
          author: "Flashbots Research",
          argument: "Builders get an 8-second window to observe market volatility after committing. During extreme events, they can abandon blocks worth $100-300 in expected value. This could lead to cascading empty slots during the exact moments when users need reliable block production most. The game theory is clear: rational builders will exploit this option.",
          evidence: [
            "https://collective.flashbots.net/t/the-free-option-problem-in-epbs/5115",
            "https://writings.flashbots.net/epbs-economic-analysis"
          ]
        },
        {
          label: "The free option is manageable",
          author: "Terence (EIP-7732 co-author)",
          argument: "The free option exists because we're maximizing slot utilization - extending blob broadcast from 2s to 10s. It's hard to exploit in practice: builders must maintain relationships with searchers and proposers, everyone sees the revealed payload context, and refunding searchers erodes profits. Plus, we can implement asymmetric payments as additional deterrent. This isn't a reason to kill ePBS.",
          evidence: [
            "https://x.com/terencechain/status/1949124850314080294",
            "https://ethresear.ch/t/epbs-builder-incentives/15420"
          ]
        }
      ]
    },
    {
      type: "argument",
      position: "The free option problem shouldn't derail ePBS",
      points: [
        "The tradeoff exists because we're scaling - without extending blob time to 10s, there's minimal free option",
        "Builders have two-sided relationships (searchers and proposers) that constrain bad behavior",
        "After payload reveal at 9s, everyone sees transaction context and versioned hashes",
        "Breaking searcher agreements requires refunds that reduce free option profits",
        "Proposers won't add random builder endpoints - reputation matters even with p2p bids"
      ],
      counterpoints: [
        "During extreme volatility like liquidation cascades, even reputable builders might rationally abandon blocks",
        "The cumulative effect could still harm user experience during critical moments"
      ],
      evidence: [
        "https://ethresear.ch/t/builder-reputation-systems/14982",
        "https://github.com/ethereum/EIPs/discussions/7732"
      ]
    },
    {
      type: "debate",
      topic: "Which proposal should take Glamsterdam's single CL slot?",
      perspectives: [
        {
          label: "Prioritize ePBS - Fix MEV Now",
          author: "Protocol Researchers",
          argument: "The relay oligopoly is an existential threat to Ethereum's credible neutrality. Every month we delay ePBS, Flashbots' dominance grows stronger. The free option concerns are overblown - practical constraints and mitigations make it manageable. If we don't enshrine PBS now, we may never get another chance as vested interests solidify.",
          evidence: [
            "https://writings.flashbots.net/relay-monitor-report",
            "https://ethresear.ch/t/timing-games-and-epbs"
          ]
        },
        {
          label: "Prioritize 6s Slots - Users First", 
          author: "App Developers & L2 Teams",
          argument: "Users don't care about relay architecture - they care about responsive apps. Halving confirmation times would be immediately felt by millions. ePBS is important but can wait for the next fork when we've had more time to fully address all concerns. Let's ship the obvious UX win now and tackle the complex MEV restructuring when it's fully baked.",
          evidence: [
            "https://ethereum-magicians.org/t/user-experience-benefits-of-6s-slots",
            "https://l2beat.com/articles/faster-slots-faster-bridges"
          ]
        }
      ]
    },
    {
      type: "tradeoff-matrix",
      dimensions: [
        {
          name: "Decentralization Impact",
          description: "How much does this improve Ethereum's decentralization?",
          scores: {
            "7732": { score: 9, icon: "🟢" },
            "7782": { score: 2, icon: "🔴" }
          }
        },
        {
          name: "User Experience",
          description: "How much do end users benefit?",
          scores: {
            "7732": { score: 3, icon: "🔴" },
            "7782": { score: 9, icon: "🟢" }
          }
        },
        {
          name: "Implementation Risk",
          description: "How likely are we to ship this successfully?",
          scores: {
            "7732": { score: 4, icon: "🟡" },
            "7782": { score: 7, icon: "🟢" }
          }
        },
        {
          name: "Future Compatibility",
          description: "Does this enable or constrain future upgrades?",
          scores: {
            "7732": { score: 8, icon: "🟢" },
            "7782": { score: 5, icon: "🟡" }
          }
        }
      ]
    },
    {
      type: "callout",
      style: "info",
      title: "The Clock is Ticking",
      content: "The August 2025 ACD consensus call will make the final decision. Client teams need clarity by then to begin implementation for the 2026 Glamsterdam upgrade. Both proposals have merit, but only one can claim the consensus layer slot."
    },
    {
      type: "summary",
      content: "The choice between ePBS and 6-second slots represents a fundamental tension in Ethereum's evolution: protocol health versus user experience. ePBS addresses an existential threat to decentralization with manageable risks - the free option problem, while real, is constrained by practical market dynamics and can be further mitigated. 6-second slots deliver immediate, tangible benefits to users and L2s but do nothing for MEV or scaling. The community must weigh immediate gratification against long-term protocol sustainability, knowing that this decision shapes Ethereum's trajectory for years to come."
    }
  ]
};

export function loadExampleComparison() {
  const hash = 'example-epbs-6s';
  localStorage.setItem(`comparison-${hash}`, JSON.stringify(EXAMPLE_COMPARISON));
  return `/compare/${hash}`;
}

export default function ExampleLoader() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const url = loadExampleComparison();
    navigate(url);
  }, [navigate]);
  
  return <div>Loading example...</div>;
}