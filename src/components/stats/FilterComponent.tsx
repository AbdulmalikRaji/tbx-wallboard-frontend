import React, { useEffect, useState } from "react";
import { selectFilterState, setFilterState} from "@/store/filterSlice";
import { useDispatch, useSelector } from "react-redux";

const FilterComponent: React.FC = () => {
    try {
        const dispatch = useDispatch();
        const filterState = useSelector(selectFilterState);
        const [filter,setFilter] = useState<string>();
    
        const handleFilterChange=(event: React.ChangeEvent<HTMLInputElement>)=>{
            setFilter(event.target.value)
        }
        const handleApplyFilter=()=>{
            dispatch(setFilterState(filter))
        }
    
        useEffect(() => {
            return () => {
    
            };
        }, []);
    
        return(
            <div className="flex-col">
                <p className="font-bold text-gray-700">Filter By Category</p>
                <div className="mt-4">
                    <input type="text" onChange={handleFilterChange} name="filter" placeholder="Enter Category" className="w-2/3 rounded-xl py-2 px-3 bg-inherit outline-cyan-600 text-slate-800 border border-gray-700"/>
                    <button onClick={handleApplyFilter} className="mx-4 p-3 text-gray-700 hover:bg-sky-600 hover:text-gray-200 rounded-xl border border-sky-600">Apply</button>
                </div>
                <p className="mt-1 text-gray-700">Current Category Filter: {filterState}</p>
            </div>
        )
    } catch (err) {
        console.error("Filter Component Error:", err)
    }

};

export default FilterComponent;