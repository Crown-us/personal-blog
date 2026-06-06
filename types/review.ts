export type ReviewStatus = "pending" | "approved" | "rejected";

export interface Review {
  id: string;
  extensionId: string;
  userId: string;
  userName?: string;
  userAvatarUrl?: string;
  rating: number;
  title?: string;
  body?: string;
  pros?: string[];
  cons?: string[];
  verified: boolean;
  helpfulVotes: number;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSummary {
  average: number;
  total: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface CreateReviewInput {
  extensionId: string;
  rating: number;
  title?: string;
  body?: string;
  pros?: string[];
  cons?: string[];
}
