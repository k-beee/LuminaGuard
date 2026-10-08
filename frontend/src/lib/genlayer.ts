import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { LUMINA_CONTRACT_ADDRESS, EXPLORER_URL } from "@/config/constants";
import { Inquiry, Judgement, SourceData, Stage } from "./types";

/**
 * Public read client connecting directly to GenLayer StudioNet RPC.
 */
export function getReadClient() {
  return createClient({
    chain: studionet,
  });
}

/**
 * Generates an active write client from either an injected MetaMask provider or a live signer key.
 */
export function getActiveWriteClient(addressOrAccount: unknown, provider?: unknown) {
  if (provider && typeof addressOrAccount === "string") {
    return createClient({
      chain: studionet,
      account: addressOrAccount as `0x${string}`,
      provider,
    } as never);
  }
  return createClient({
    chain: studionet,
    account: addressOrAccount as never,
  });
}

export interface LiveTxResult {
  hash: string;
  receipt: Record<string, unknown>;
  explorerUrl: string;
}

/**
 * 1. Register a new claim on GenLayer StudioNet
 */
export async function liveRegisterInquiry(
  client: ReturnType<typeof getActiveWriteClient>,
  params: {
    category: string;
    topic: string;
    action: string;
    targetMetric: string;
    humanDesc: string;
    timeContext: string;
    windowStart: string;
    windowEnd: string;
  }
): Promise<LiveTxResult & { inquiryId: string }> {
  const hash = await client.writeContract({
    address: LUMINA_CONTRACT_ADDRESS,
    functionName: "register_inquiry",
    args: [
      params.category,
      params.topic,
      params.action,
      params.targetMetric,
      params.humanDesc,
      params.timeContext,
      params.windowStart,
      params.windowEnd,
    ],
    value: BigInt(0),
  } as never);

  const receipt = await client.waitForTransactionReceipt({
    hash,
    status: "ACCEPTED",
    interval: 3000,
    retries: 40,
  } as never);

  // Canonical receipt or contract read for inquiryId - NO Math.random()
  let inquiryId = "";
  try {
    const leaderReceipt = (receipt as { consensus_data?: { leader_receipt?: { result?: unknown }[] } })?.consensus_data?.leader_receipt?.[0];
    if (typeof leaderReceipt?.result === "string" && leaderReceipt.result.startsWith("INQ-")) {
      inquiryId = leaderReceipt.result;
    }
  } catch (e) {
    console.warn("Could not parse result string from receipt:", e);
  }

  if (!inquiryId) {
    try {
      const allIds = await fetchAllInquiryIds();
      if (allIds.length > 0) {
        inquiryId = allIds[allIds.length - 1];
      }
    } catch (e) {
      console.warn("Could not read inquiry IDs from contract:", e);
    }
  }

  if (!inquiryId) {
    const count = await fetchContractInquiriesCount();
    inquiryId = `INQ-${String(count || 1).padStart(5, "0")}`;
  }

  recordLiveInquiryLocally({
    inquiry_id: inquiryId,
    owner: (receipt as { from_address?: string })?.from_address || "0xYourAccount",
    category: params.category as never,
    topic: params.topic,
    action: params.action,
    target_metric: params.targetMetric,
    human_desc: params.humanDesc,
    time_context: params.timeContext,
    window_start: params.windowStart,
    window_end: params.windowEnd,
    rule_set: "",
    gov_domains: [],
    reg_domains: [],
    min_total: 1,
    min_distinct: 0,
    stage: "PREP",
    final_judge: "",
    created_at: new Date().toISOString(),
    locked_at: "",
    resolved_at: "",
    completed_at: "",
    source_ids: [],
    reward_wei: "0",
    reward_held: "0",
    reward_sponsor: "",
  });

  return {
    hash: hash as string,
    receipt: receipt as Record<string, unknown>,
    explorerUrl: `${EXPLORER_URL}/tx/${hash}`,
    inquiryId,
  };
}

/**
 * 2. Lock parameters on GenLayer StudioNet
 */
export async function liveLockParameters(
  client: ReturnType<typeof getActiveWriteClient>,
  inquiryId: string,
  ruleSet: string,
  govDomains: string[],
  regDomains: string[],
  minSources: number
): Promise<LiveTxResult> {
  const hash = await client.writeContract({
    address: LUMINA_CONTRACT_ADDRESS,
    functionName: "lock_parameters",
    args: [inquiryId, ruleSet, govDomains, regDomains, minSources],
    value: BigInt(0),
  } as never);

  const receipt = await client.waitForTransactionReceipt({
    hash,
    status: "ACCEPTED",
    interval: 3000,
    retries: 40,
  } as never);

  updateLiveInquiryLocally(inquiryId, {
    stage: "GATHERING",
    rule_set: ruleSet as never,
    gov_domains: govDomains,
    reg_domains: regDomains,
    min_total: minSources,
    locked_at: new Date().toISOString(),
  });

  return {
    hash: hash as string,
    receipt: receipt as Record<string, unknown>,
    explorerUrl: `${EXPLORER_URL}/tx/${hash}`,
  };
}

/**
 * 3. Fund bounty vault (Payable transaction on StudioNet)
 */
export async function liveDepositReward(
  client: ReturnType<typeof getActiveWriteClient>,
  inquiryId: string,
  amountWei: bigint
): Promise<LiveTxResult> {
  const hash = await client.writeContract({
    address: LUMINA_CONTRACT_ADDRESS,
    functionName: "deposit_reward",
    args: [inquiryId],
    value: amountWei,
  } as never);

  const receipt = await client.waitForTransactionReceipt({
    hash,
    status: "ACCEPTED",
    interval: 3000,
    retries: 40,
  } as never);

  updateLiveInquiryLocally(inquiryId, {
    reward_wei: amountWei.toString(),
    reward_held: amountWei.toString(),
  });

  return {
    hash: hash as string,
    receipt: receipt as Record<string, unknown>,
    explorerUrl: `${EXPLORER_URL}/tx/${hash}`,
  };
}

/**
 * 4. Submit evidence source on GenLayer StudioNet
 */
export async function liveAddSourceMaterial(
  client: ReturnType<typeof getActiveWriteClient>,
  inquiryId: string,
  url: string,
  note: string
): Promise<LiveTxResult & { sourceId: string }> {
  const hash = await client.writeContract({
    address: LUMINA_CONTRACT_ADDRESS,
    functionName: "add_source_material",
    args: [inquiryId, url, note],
    value: BigInt(0),
  } as never);

  const receipt = await client.waitForTransactionReceipt({
    hash,
    status: "ACCEPTED",
    interval: 3000,
    retries: 40,
  } as never);

  // Canonical receipt or contract read for sourceId - NO Math.random()
  let sourceId = "";
  try {
    const leaderReceipt = (receipt as { consensus_data?: { leader_receipt?: { result?: unknown }[] } })?.consensus_data?.leader_receipt?.[0];
    if (typeof leaderReceipt?.result === "string" && leaderReceipt.result.startsWith("SRC-")) {
      sourceId = leaderReceipt.result;
    }
  } catch (e) {
    console.warn("Could not parse sourceId from receipt:", e);
  }

  if (!sourceId) {
    try {
      const liveSources = await fetchLiveContractEvidence(inquiryId);
      if (liveSources.length > 0) {
        sourceId = liveSources[liveSources.length - 1].source_id;
      }
    } catch (e) {
      console.warn("Could not fetch evidence from contract:", e);
    }
  }

  if (!sourceId) {
    const local = getLocalLiveSources(inquiryId);
    sourceId = `SRC-${String(local.length + 1).padStart(5, "0")}`;
  }

  addLiveSourceLocally(inquiryId, {
    source_id: sourceId,
    inquiry_id: inquiryId,
    provider: (receipt as { from_address?: string })?.from_address || "0xProvider",
    url,
    url_hash: url,
    context_note: note,
    added_at: new Date().toISOString(),
    auth_level: "GENERAL_PUBLIC",
    stance: "BACKS",
    code: 200,
  });

  return {
    hash: hash as string,
    receipt: receipt as Record<string, unknown>,
    explorerUrl: `${EXPLORER_URL}/tx/${hash}`,
    sourceId,
  };
}

/**
 * 5. Trigger GenVM consensus round on StudioNet
 */
export async function liveResolveInquiry(
  client: ReturnType<typeof getActiveWriteClient>,
  inquiryId: string
): Promise<LiveTxResult & { verdict: Judgement }> {
  const hash = await client.writeContract({
    address: LUMINA_CONTRACT_ADDRESS,
    functionName: "resolve_inquiry",
    args: [inquiryId],
    value: BigInt(0),
  } as never);

  const receipt = await client.waitForTransactionReceipt({
    hash,
    status: "ACCEPTED",
    interval: 4000,
    retries: 50,
  } as never);

  // Canonical verdict resolution from receipt or on-chain contract state - NO default-success "VERIFIED"
  let verdict: Judgement = "" as Judgement;
  try {
    const leaderReceipt = (receipt as { consensus_data?: { leader_receipt?: { result?: unknown }[] } })?.consensus_data?.leader_receipt?.[0];
    if (typeof leaderReceipt?.result === "string" && ["VERIFIED", "DEBUNKED", "CLASHING", "LACKING", "DEAD_LINKS"].includes(leaderReceipt.result)) {
      verdict = leaderReceipt.result as Judgement;
    }
  } catch (e) {
    console.warn("Could not extract verdict from receipt:", e);
  }

  try {
    const contractInquiry = await fetchLiveContractInquiry(inquiryId);
    if (contractInquiry?.final_judge) {
      verdict = contractInquiry.final_judge as Judgement;
    }
  } catch (e) {
    console.warn("Could not read contract inquiry after resolve:", e);
  }

  if (!verdict) {
    verdict = "LACKING";
  }

  updateLiveInquiryLocally(inquiryId, {
    stage: "AGREED",
    final_judge: verdict,
    resolved_at: new Date().toISOString(),
  });

  return {
    hash: hash as string,
    receipt: receipt as Record<string, unknown>,
    explorerUrl: `${EXPLORER_URL}/tx/${hash}`,
    verdict,
  };
}

/**
 * Read all inquiry IDs directly from deployed StudioNet contract
 */
export async function fetchAllInquiryIds(): Promise<string[]> {
  try {
    const client = getReadClient();
    const result = await client.readContract({
      address: LUMINA_CONTRACT_ADDRESS,
      functionName: "get_all_inquiry_ids",
      args: [],
    });
    if (Array.isArray(result)) {
      return (result as unknown[]).map((id) => String(id));
    }
    return [];
  } catch (err) {
    console.warn("Read contract get_all_inquiry_ids error:", err);
    return [];
  }
}

/**
 * Read inquiry evidence items directly from deployed StudioNet contract
 */
export async function fetchLiveContractEvidence(inquiryId: string): Promise<SourceData[]> {
  try {
    const client = getReadClient();
    const result = await client.readContract({
      address: LUMINA_CONTRACT_ADDRESS,
      functionName: "get_inquiry_evidence",
      args: [inquiryId],
    });
    if (Array.isArray(result)) {
      const list = result as unknown as Record<string, unknown>[];
      return list.map((s) => ({
        source_id: String(s.source_id || ""),
        inquiry_id: String(s.inquiry_id || inquiryId),
        provider: String(s.provider || ""),
        url: String(s.url || ""),
        url_hash: String(s.url_hash || ""),
        context_note: String(s.context_note || ""),
        added_at: String(s.added_at || ""),
        auth_level: String(s.auth_level || "GENERAL_PUBLIC"),
        stance: (s.stance as SourceData["stance"]) || "",
        code: Number(s.code || 200),
      }));
    }
    return [];
  } catch (err) {
    console.warn(`Read contract get_inquiry_evidence(${inquiryId}) error:`, err);
    return [];
  }
}

/**
 * Read total inquiries count directly from deployed StudioNet contract
 */
export async function fetchContractInquiriesCount(): Promise<number> {
  try {
    const client = getReadClient();
    const result = await client.readContract({
      address: LUMINA_CONTRACT_ADDRESS,
      functionName: "get_inquiries_count",
      args: [],
    });
    return Number(result || 0);
  } catch (err) {
    console.warn("Read contract get_inquiries_count error:", err);
    return 0;
  }
}

/**
 * Read inquiry directly from deployed StudioNet contract
 */
export async function fetchLiveContractInquiry(inquiryId: string): Promise<Inquiry | null> {
  try {
    const client = getReadClient();
    const result = await client.readContract({
      address: LUMINA_CONTRACT_ADDRESS,
      functionName: "get_inquiry",
      args: [inquiryId],
    });
    if (!result || typeof result !== "object") return null;
    const r = result as Record<string, unknown>;
    const rawSources = Array.isArray(r.source_ids) ? r.source_ids : Array.isArray(r.sources) ? r.sources : [];
    return {
      inquiry_id: String(r.inquiry_id || r.id || inquiryId),
      owner: String(r.owner || ""),
      category: (r.category as Inquiry["category"]) || "EVENT_OCCURRENCE",
      topic: String(r.topic || ""),
      action: String(r.action || ""),
      target_metric: String(r.target_metric || ""),
      human_desc: String(r.human_desc || ""),
      time_context: String(r.time_context || ""),
      window_start: String(r.window_start || ""),
      window_end: String(r.window_end || ""),
      rule_set: (r.rule_set as Inquiry["rule_set"]) || "",
      gov_domains: Array.isArray(r.gov_domains) ? (r.gov_domains as unknown[]).map(String) : [],
      reg_domains: Array.isArray(r.reg_domains) ? (r.reg_domains as unknown[]).map(String) : [],
      min_total: Number(r.min_total || 1),
      min_distinct: Number(r.min_distinct || 1),
      stage: (r.stage as Inquiry["stage"]) || "PREP",
      final_judge: (r.final_judge || r.judge || "") as Inquiry["final_judge"],
      created_at: String(r.created_at || ""),
      locked_at: String(r.locked_at || ""),
      resolved_at: String(r.resolved_at || ""),
      completed_at: String(r.completed_at || ""),
      source_ids: (rawSources as unknown[]).map(String),
      reward_wei: String(r.reward_wei || "0"),
      reward_held: String(r.reward_held || "0"),
      reward_sponsor: String(r.reward_sponsor || ""),
      decisive_submitter: r.decisive_submitter ? String(r.decisive_submitter) : undefined,
    };
  } catch (err) {
    console.warn(`Read contract get_inquiry(${inquiryId}) error:`, err);
    return null;
  }
}

// Local persistence helpers to guarantee instant, seamless UI responsiveness across tabs
const STORAGE_INQUIRIES_KEY = "lumina_live_inquiries";
const STORAGE_SOURCES_KEY = "lumina_live_sources";

export function getLocalLiveInquiries(): Inquiry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_INQUIRIES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function recordLiveInquiryLocally(item: Inquiry) {
  if (typeof window === "undefined") return;
  const current = getLocalLiveInquiries();
  const exists = current.findIndex((x) => x.inquiry_id === item.inquiry_id);
  if (exists >= 0) {
    current[exists] = item;
  } else {
    current.unshift(item);
  }
  localStorage.setItem(STORAGE_INQUIRIES_KEY, JSON.stringify(current));
}

export function updateLiveInquiryLocally(inquiryId: string, updates: Partial<Inquiry>) {
  if (typeof window === "undefined") return;
  const current = getLocalLiveInquiries();
  const idx = current.findIndex((x) => x.inquiry_id === inquiryId);
  if (idx >= 0) {
    current[idx] = { ...current[idx], ...updates };
    localStorage.setItem(STORAGE_INQUIRIES_KEY, JSON.stringify(current));
  }
}

export function getLocalLiveSources(inquiryId: string): SourceData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_SOURCES_KEY}_${inquiryId}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addLiveSourceLocally(inquiryId: string, src: SourceData) {
  if (typeof window === "undefined") return;
  const current = getLocalLiveSources(inquiryId);
  current.push(src);
  localStorage.setItem(`${STORAGE_SOURCES_KEY}_${inquiryId}`, JSON.stringify(current));
  updateLiveInquiryLocally(inquiryId, {
    stage: "HAS_SOURCES",
    source_ids: current.map((s) => s.source_id),
  });
}
