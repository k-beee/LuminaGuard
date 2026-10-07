# LuminaGuard 🛡️🐉

LuminaGuard is a highly-resilient, decentralized, unbiased Fact Adjudication engine built on GenLayer. 
It enables the seamless validation of claims by utilizing community-submitted sources, rigorous LLM evaluation, and transparent deterministic processing.

## How it works (The Dragon Flow)

```mermaid
graph TD
    classDef dragon fill:#f9f,stroke:#333,stroke-width:2px;
    classDef fire fill:#f66,stroke:#333,stroke-width:2px;
    
    A[🐲 Inquiry Declared] -->|Lock Parameters| B(🔒 Rules Locked);
    B -->|Sponsor| C{💰 Bounty Vault};
    C -->|Bounty Active| D[🌍 Community Gathers Sources];
    D -->|Submit URL + Context| E[📚 Sources Registered];
    E -->|Trigger Consensus| F((🔥 Dragon's Breath LLM Evaluation));
    
    F -->|GenVM Validators Check Readings| G{Consensus Result};
    G -->|Disagreement| H[❌ Rejected / Retry];
    G -->|Agreed Stances| I[⚖️ Deterministic Adjudication];
    
    I -->|All Sources Support| J[✅ Verified];
    I -->|All Sources Deny| K[🛑 Debunked];
    I -->|Mixed Findings| L[⚔️ Clashing];
    
    J --> M((🏆 Reward Distributed to Best Source));
    K --> M;
    L --> N[💸 Reward Refunded];
    
    class A,B,C dragon;
    class F fire;
```

## Setup & Deployment

1. **Smart Contract:** The contract is located in `contracts/lumina_guard.py`. It is a fully GenVM compatible smart contract ready for StudioNet.
2. **Frontend:** The frontend is a Next.js application that provides a sleek, dark-mode, highly professional interface to manage inquiries, submit sources, and view verdicts.

## Architecture

- **GenVM Python Contract**: Core logic to safely register claims, lock parameters, receive evidence, and run a safe consensus using `gl.vm.run_nondet_unsafe`.
- **Next.js Frontend**: A modern React application with shadcn/ui components for a premium user experience.

---
**Built by k_bee**
