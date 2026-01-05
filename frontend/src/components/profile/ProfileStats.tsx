import React from "react";
import Card from "../ui/Card";

const ProfileStats: React.FC<{ views:number; rating:number; reviews:number; responseRate:string }> = ({ views, rating, reviews, responseRate }) => {
  return (
    <Card>
      <h3 className="font-semibold mb-3">Profile Stats</h3>
      <div className="text-sm text-gray-600">
        <div className="flex justify-between mb-2"><span>Profile Views</span><span>{views}</span></div>
        <div className="flex justify-between mb-2"><span>Rating</span><span>⭐ {rating.toFixed(1)}</span></div>
        <div className="flex justify-between mb-2"><span>Total Reviews</span><span>{reviews}</span></div>
        <div className="flex justify-between"><span>Response Rate</span><span>{responseRate}</span></div>
      </div>
    </Card>
  );
};

export default ProfileStats;
