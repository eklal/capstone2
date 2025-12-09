import React from "react";
import ReviewCard from "./ReviewCard";

const ReviewsList: React.FC<{ reviews: any[] }> = ({ reviews }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Recent Reviews</h3>
      <div className="space-y-4">
        {reviews.map((r, i) => <ReviewCard key={i} {...r} />)}
      </div>
    </div>
  );
};

export default ReviewsList;
