"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AnimeDescriptionProps {
  description: string | null;
}

export function AnimeDescription({ description }: AnimeDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description) {
    return null;
  }

  // Remove HTML tags
  const cleanDescription = description.replace(/<[^>]*>/g, "");
  const isLong = cleanDescription.length > 300;
  const displayText = isExpanded || !isLong
    ? cleanDescription
    : cleanDescription.slice(0, 300) + "...";

  return (
    <div className="bg-white border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
      <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
        <span className="w-2 h-8 bg-pink-500 rounded" />
        Description
      </h2>
      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
        {displayText}
      </div>
      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-pink-200 hover:bg-pink-300 border-2 border-black rounded-lg font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show More
            </>
          )}
        </button>
      )}
    </div>
  );
}
