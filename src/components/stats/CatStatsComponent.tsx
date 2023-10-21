import React, { useEffect, useState } from "react";
import withAuth from "@/helpers/withAuth";
import { useRouter } from "next/router";
import { selectFilterState, setFilterState } from "@/store/filterSlice";
import { useDispatch, useSelector } from "react-redux";
import { Product } from "@/interfaces/product_interface";
import { CategoryCounts } from "@/interfaces/cat_count_interface";
import { selectCatCount, selectTotalCatCount } from "@/store/catCountSlice";

interface CatStatsComponentProps {
  products: Array<Product>;
  categories: CategoryCounts;  
}

const CatStatsComponent: React.FC<CatStatsComponentProps> = ({ products , categories}) => {
  try {
    const filterState = useSelector(selectFilterState);
    const [catCounter, setCatCounter] = useState<CategoryCounts>({});
    const [totalCount, setTotalCount] = useState<number>(0);
    const catCount = categories
    const totalCatCount = Object.values(categories).reduce((sum, count) => sum + count, 0);
    const dispatch = useDispatch();
    const [totalFilterdCatCount, setTotalFilterdCatCount] = useState<number>(0);
    const [totalUnfilterdCatCount, setTotalUnfilterdCatCount] =
      useState<number>(0);
    const [showCombinedPercentages, setShowCombinedPercentages] =
      useState(true);

    const filteredCategories: Array<[string, number]> = [];
    const nonFilteredCategories: Array<[string, number]> = [];

    const handleCatClick = (category: string) => {
      dispatch(setFilterState(category));
      console.log(filterState);
    };
    const togglePercentages = () => {
      setShowCombinedPercentages(!showCombinedPercentages);
    };

    useEffect(() => {
      setTotalFilterdCatCount(
        filteredCategories.reduce((acc, [, value]) => acc + value, 0)
      );
      setTotalUnfilterdCatCount(
        nonFilteredCategories.reduce((acc, [, value]) => acc + value, 0)
      );
    });
    // useEffect(() => {

    //     const updatedCatCounter:  CategoryCounts = {};
    //     setTotalCount(products.length)
    //     products.forEach((product) => {
    //     const category = product.Category;
    //       if (updatedCatCounter.hasOwnProperty(category)) {
    //         updatedCatCounter[category] += 1;
    //       } else {
    //         updatedCatCounter[category] = 1;
    //       }
    //     });

    //     setCatCounter((prevCounter: { [category: string]: number }) => {
    //       return {
    //         ...prevCounter,
    //         ...updatedCatCounter,
    //       };
    //     });

    //     return () => {

    //     };
    // }, [products]);

    Object.entries(catCount).forEach(([key, value]) => {
      try {
        var isFiltered;
        if (filterState === undefined) {
          isFiltered = false;
        } else {
          isFiltered = filterState.length !== 0 && filterState.includes(key);
        }

        if (isFiltered) {
          filteredCategories.push([key, value]);
        } else {
          nonFilteredCategories.push([key, value]);
        }
      } catch (err) {
        console.error("Catstats: Filter Error: ", err);
      }
    });

    return (
      <div className=" overflow-y-auto">
        <h2 className="font-bold text-gray-700">Statistics by Category</h2>

        <p className="text-gray-700 text-sm">
          - Click category to filter/unfilter -
        </p>
        <button
          className="text-sky-700 hover:text-sky-900 hover:text-lg transition-all duration-200 font-bold cursor-pointer"
          onClick={togglePercentages}
        >
          {showCombinedPercentages
            ? "Show Split Percentages"
            : "Show Combined Percentages"}
        </button>

        <ul className="bg-slate-100 p-2 mt-2 rounded-xl overflow-y-auto overflow-x-hidden max-h-[50rem] scrollbar-thin scrollbar-thumb-sky-600 scrollbar-track-slate-100">
          <p className="text-gray-700">
            Filtered Categories ({filteredCategories.length})
          </p>
          {/* Render filtered categories */}
          {filteredCategories.map(([key, value]) => {
             const percentage= !showCombinedPercentages? ((value / totalFilterdCatCount) * 100).toFixed(2):((value / totalCatCount) * 100).toFixed(2);

            //const percentage = ((value / totalCatCount) * 100).toFixed(2);
            return (
              <li
                key={key}
                className={`py-2 m-2 rounded-xl grid grid-cols-3 gap-2 justify-between justify-items-center bg-slate-100 border border-blue-500 text-sky-700 font-bold cursor-pointer relative `}
                onClick={() => handleCatClick(key)}
              >
                <span>{key}</span>
                <span>{value}</span>
                <span>{percentage}%</span>
                <div
                  className="absolute top-0 left-0 w-full h-full bg-sky-600 opacity-25"
                  style={{ width: `${percentage}%` }}
                ></div>
              </li>
            );
          })}

          <hr className="border-gray-600 my-4"></hr>
          <p className="text-gray-700">
            Unfiltered Categories ({nonFilteredCategories.length})
          </p>
          {/* Render non-filtered categories */}
          {nonFilteredCategories.map(([key, value]) => {
            const percentage= !showCombinedPercentages? ((value / totalUnfilterdCatCount) * 100).toFixed(2):((value / totalCatCount) * 100).toFixed(2);
            
            return (
              <div
                key={key}
                className=" pl-2 pr-4 mt-2 rounded-xl w-full relative overflow-hidden cursor-pointer"
                onClick={() => handleCatClick(key)}
              >
                <div
                  className="w-full h-full absolute top-0 left-0 bg-sky-600 opacity-25"
                  style={{ width: `${percentage}%` }}
                ></div>
                <div className="text-black relative top-0 left-0 w-full h-full flex items-center justify-between ">
                  <div className="grid grid-cols-3 w-full">
                    <span className="text-sky-700 font-bold col-span-2">
                      {key}
                    </span>
                    <span className="font-bold col-span-1 pl-6">{value}</span>
                    <span className="col-span-1">{percentage}%</span>
                  </div>
                </div>
                <br />
              </div>
            );
          })}
        </ul>
      </div>
    );
  } catch (err) {
    console.error("Catstats Component Error:", err);
  }
};

export default CatStatsComponent;
