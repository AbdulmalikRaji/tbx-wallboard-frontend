import React, { useEffect, useState } from "react";
import { selectFilterState, setFilterState} from "@/store/filterSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectTotalCountAnalysis } from "@/store/totalCountAnalysisSlice";
import { selectUniqueCategoryCount } from "@/store/catCountSlice";
import { Analysis } from "@/interfaces/analysis_interface";
import { CategoryCounts } from "@/interfaces/cat_count_interface";

interface TotalCatStatComponentProps {
  catCounts: Analysis[];
  categories: CategoryCounts; 
}

const TotalCatStatComponent: React.FC<TotalCatStatComponentProps> = ({catCounts, categories}) => {
    try {
        const catCount = categories
        //console.log(categories)
        const totalCatCount = Object.values(categories).reduce((sum, count) => sum + count, 0);
        //console.log(totalCatCount)
        const filterState = useSelector(selectFilterState);
        const filteredCategories: Array<[string, number]> = [];
        const nonFilteredCategories: Array<[string, number]> = [];

        Object.entries(catCount).forEach(([key, value]) => {
            try {
              var isFiltered
              
              if (filterState === undefined) {
                   isFiltered = false;
              }else {
                  isFiltered = filterState.length !== 0 && filterState.includes(key);
                  console.log(isFiltered)
              }
              if (isFiltered) {
                filteredCategories.push([key, value]);
              } else {
                nonFilteredCategories.push([key, value]);
              }
            } catch (err) {
              console.error("Catstats: Filter Error: ", err)
            }
          });

        const totalFilteredPercentage = filteredCategories.reduce((acc, [key, value]) => {
            const percentage = (value / totalCatCount) * 100;
            return acc + percentage;
          }, 0).toFixed(2);

          const totalunFilteredPercentage = nonFilteredCategories.reduce((acc, [key, value]) => {
            const percentage = (value / totalCatCount) * 100;
            return acc + percentage;
          }, 0).toFixed(2);
    
          return (
            <div className="mx-4"> 
              <h2 className="text-gray-700 font-bold text-xl">General Statistics</h2>
              <div className="flex flex-row space-x-4">
                {catCounts.map(cat => (<div className="w-1/4 p-4 rounded-md bg-gray-50 my-2 text-center drop-shadow-md">
                  <p className="text-gray-700 font-bold">{cat.Title}: {cat.Value}</p>
                </div>))}
                {/* <div className="w-1/4 p-4 rounded-md bg-gray-50 my-2 text-center drop-shadow-md">
                  <p className="text-gray-700 font-bold">Total number of products: {totalCountAnalysisSelect.Value}</p>
                </div>
                <div className="w-1/4 p-4 rounded-md bg-gray-50 my-2 text-center drop-shadow-md">
                  <p className="text-gray-700 font-bold">Total number of categories: {uniqueCategoryCount}</p>
                </div> */}
                <div className="relative w-1/4 p-4 rounded-md bg-gray-50 my-2 text-center drop-shadow-md overflow-hidden">
                  <p className="text-gray-700 font-bold">Total % of filtered categories {totalFilteredPercentage}</p>
                  <div
                    className="h-full absolute top-0 left-0 bg-sky-600 opacity-25"
                    style={{ width: `${totalFilteredPercentage}%` }}
                  ></div>
                </div>
                <div className="relative w-1/4 p-4 rounded-md bg-gray-50 my-2 text-center drop-shadow-md overflow-hidden">
                  <p className="text-gray-700 font-bold">Total % of unfiltered categories {totalunFilteredPercentage}</p>
                  <div
                    className="h-full absolute top-0 left-0 bg-sky-600 opacity-25"
                    style={{ width: `${totalunFilteredPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
          
          
    } catch (err) {
        console.error("Total category statistics Component Error:", err)
    }

};

export default TotalCatStatComponent;