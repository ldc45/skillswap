"use client";

import React from "react";
import { useParams } from "next/navigation";

export default function PartnerDetailPage() {
  const params = useParams();
  const { id } = params;

  return (
    <div>
      <h1 className="text-3xl font-bold">Page Partenaire {id}</h1>
    </div>
  );
}