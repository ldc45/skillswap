"use client";

import UserAvailabilities from "@/components/userAvailabilities/UserAvailabilities";
import UserProfile from "@/components/userProfile/UserProfile";
import React from "react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col md:p-4 lg:p-8 lg:flex-row">
      <UserProfile />
      <UserAvailabilities />
    </div>
  );
}
