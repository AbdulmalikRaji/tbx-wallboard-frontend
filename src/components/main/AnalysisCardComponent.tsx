import { Analysis } from "@/interfaces/analysis_interface";
import React from "react";

interface AnalysisCardComponentProps {
  analysis: Analysis;
}

const AnalysisCardComponent: React.FC<AnalysisCardComponentProps> = ({analysis}) => {
  try {
    return (
      <div className="w-full h-24 sm:h-32 rounded-xl bg-gray-50 p-2 text-center drop-shadow-md">
        <p className="text-gray-800 text-3xl sm:text-4xl md:text-5xl font-semibold">{analysis.Value}</p>
        <p className="text-gray-600 text-xs sm:text-sm md:text-base">{analysis.Title}</p>
      </div>
    );
  }
  catch (err) {
    console.error("AnalysisCard Component error:", err)
  }}

export default AnalysisCardComponent;
