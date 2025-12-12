// 🏷️ ReviewStatusBadge - Shows the branding status of this here cattle

type ReviewStatusBadgeProps = {
  decision: string | null | undefined;
};

const brands = {
  APPROVED: {
    text: "🏷️ Branded & Ready",
    color: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
  },
  CHANGES_REQUESTED: {
    text: "🔧 Needs Re-shoein'",
    color: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
  },
  REVIEW_REQUIRED: {
    text: "👀 Needs Inspectin'",
    color:
      "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
  },
} as const;

export const ReviewStatusBadge = ({ decision }: ReviewStatusBadgeProps) => {
  if (!decision) return null;

  const brand = brands[decision as keyof typeof brands];
  if (!brand) return null;

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ${brand.color}`}>
      {brand.text}
    </span>
  );
};
