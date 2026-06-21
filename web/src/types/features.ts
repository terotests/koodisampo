/** A learnable pattern or concept — karma grows without a cap */
export type FeatureGrant = {
  id: string;
  /** Karma added on success; default 3 (choice) or 5 (code) */
  karma?: number;
};

export type FeatureDef = {
  id: string;
  label: string;
  /** Top-level language/topic, e.g. cpp */
  topic: string;
  /** Optional grouping within topic */
  group?: string;
  description?: string;
};

export type PlayerFeature = {
  featureId: string;
  karma: number;
  practiceCount: number;
  firstLearnedAt: number;
  lastPracticedAt: number;
};
