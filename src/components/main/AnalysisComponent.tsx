import React from "react";
import AnalysisCardComponent from "./AnalysisCardComponent";
import { useSelector } from "react-redux";
import { selectUniqueCategoryCount } from "@/store/catCountSlice";
import { Analysis } from "@/interfaces/analysis_interface";

interface AnalysisComponentProps {
  productCounts: Analysis[];
}

const AnalysisComponent: React.FC<AnalysisComponentProps> = ({ productCounts }) => {
  try {
    const uniqueCategoryCount = useSelector(selectUniqueCategoryCount);
    const categoryCount: Analysis = { Title: "Total Category Count", Value: uniqueCategoryCount.toString() };
    return (
      <div className="flex justify-center gap-4">
        {productCounts.map(analysis => (<div key={analysis.Title} className="w-full">
          <AnalysisCardComponent analysis={analysis} />
        </div>))}
      </div>
    );
  } catch (err) {
    console.error("Analysis Component Error:", err);
  }
};

export default AnalysisComponent;
