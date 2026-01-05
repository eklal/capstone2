import React from "react";

const ReviewCard: React.FC<{ author:string; rating:number; time:string; content:string }> = ({ author, rating, time, content }) => {
  return (
    <div className="p-4 border rounded bg-white">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">👤</div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">{author}</div>
              <div className="text-xs text-gray-500">{time}</div>
            </div>
            <div className="text-sm">⭐ {rating}</div>
          </div>
          <p className="text-sm text-gray-700 mt-2">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
