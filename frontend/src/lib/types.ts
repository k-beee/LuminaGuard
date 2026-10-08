export type Category = 
  | "EVENT_OCCURRENCE"
  | "ENTITY_STATUS"
  | "PUBLIC_DECLARATION"
  | "TIME_SENSITIVE_FACT";

export type RuleSet = 
  | "STRICT_OFFICIAL"
  | "REGULATOR_ONLY"
  | "DIVERSE_SOURCES"
  | "PRIMARY_AND_SUPPORT"
  | "ANY_EVIDENCE";

export type Stage = 
  | "PREP"
  | "REGISTERED"
  | "GATHERING"
  | "HAS_SOURCES"
  | "READY_FOR_VOTE"
  | "AGREED"
  | "COMPLETED"
  | "OBSOLETE"
  | "ABORTED";

export type Judgement = 
  | "VERIFIED"
  | "DEBUNKED"
  | "CLASHING"
  | "LACKING"
  | "DEAD_LINKS";

export type Stance = "BACKS" | "DENIES" | "QUIET";

export interface SourceData {
  source_id: string;
  inquiry_id: string;
  provider: string;
  url: string;
  url_hash: string;
  context_note: string;
  added_at: string;
  auth_level: string;
  stance: Stance | "";
  code: number;
}

export interface Inquiry {
  inquiry_id: string;
  owner: string;
  category: Category;
  topic: string;
  action: string;
  target_metric: string;
  human_desc: string;
  time_context: string;
  window_start: string;
  window_end: string;
  rule_set: RuleSet | "";
  gov_domains: string[];
  reg_domains: string[];
  min_total: number;
  min_distinct: number;
  stage: Stage;
  final_judge: Judgement | "";
  created_at: string;
  locked_at: string;
  resolved_at: string;
  completed_at: string;
  source_ids: string[];
  reward_wei: string;
  reward_held: string;
  reward_sponsor: string;
  decisive_submitter?: string;
}

export interface ProtocolMetrics {
  totalInquiries: number;
  resolvedSafely: number;
  activeGathering: number;
  totalBountiesWei: string;
  validatorRounds: number;
}
