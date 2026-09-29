/**
 * MongoDB / Mongoose schemas for EtsyRank Lab.
 *
 * MVP: these schemas are defined but NOT connected — all data is mocked
 * (see lib/mock-data.ts). Phase 2: set MONGODB_URI and connect via
 * `mongoose.connect(process.env.MONGODB_URI)` in a lib/db.ts helper.
 *
 * Collections:
 *  - users          : accounts, plan, credit balance
 *  - keywordcaches  : cached Etsy API keyword results (TTL expiry)
 *  - credits        : ledger of credit debits per tool use
 */

import mongoose, { Document, Model, Schema } from "mongoose";

/* ---------------------------------- User ---------------------------------- */

export interface IUser extends Document {
  email: string;
  name?: string;
  /** password hash — MVP uses no auth; Phase 2: NextAuth credentials/OAuth */
  passwordHash?: string;
  plan: "free" | "starter" | "pro" | "enterprise";
  /** daily-refreshing tool credit balance */
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    name: { type: String, trim: true },
    passwordHash: { type: String, select: false },
    plan: { type: String, enum: ["free", "starter", "pro", "enterprise"], default: "free" },
    credits: { type: Number, default: 25 },
  },
  { timestamps: true }
);

/* ------------------------------- KeywordCache ------------------------------ */
/**
 * 3-layer cache strategy (Phase 2):
 *   1. in-memory (per-instance Map with 5-min TTL)
 *   2. this MongoDB collection (TTL index, 24h)
 *   3. live Etsy Open API v3 call on miss
 *
 * Cache key = normalized keyword + tool name, so different tools don't collide.
 */

export interface IKeywordCache extends Document {
  key: string; // e.g. "kw:personalized gold name necklace"
  tool: string; // "keyword-research" | "competition" | "market-insight" ...
  payload: Record<string, unknown>;
  fetchedAt: Date;
  expiresAt: Date;
}

const KeywordCacheSchema = new Schema<IKeywordCache>(
  {
    key: { type: String, required: true, index: true },
    tool: { type: String, required: true, index: true },
    payload: { type: Schema.Types.Mixed, required: true },
    fetchedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: false }
);
// Auto-delete expired entries; Phase 2 relies on this instead of manual sweeps.
KeywordCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
KeywordCacheSchema.index({ key: 1, tool: 1 }, { unique: true });

/* --------------------------------- Credit ---------------------------------- */
/** Append-only ledger: every tool call writes one debit row. */

export interface ICredit extends Document {
  userId: mongoose.Types.ObjectId;
  tool: string;
  amount: number; // negative = debit, positive = grant/refund
  reason: string;
  createdAt: Date;
}

const CreditSchema = new Schema<ICredit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tool: { type: String, required: true },
    amount: { type: Number, required: true },
    reason: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

/* ------------------------------ model exports ------------------------------ */
// Guard against OverwriteModelError in Next.js dev (hot reload).

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export const KeywordCache: Model<IKeywordCache> =
  mongoose.models.KeywordCache ||
  mongoose.model<IKeywordCache>("KeywordCache", KeywordCacheSchema);

export const Credit: Model<ICredit> =
  mongoose.models.Credit || mongoose.model<ICredit>("Credit", CreditSchema);
