import React, { useEffect, useState } from "react";
import withAuth from "@/helpers/withAuth";
import { useRouter } from 'next/router'
import FilterComponent from "./FilterComponent";
import CatStatsComponent from "./CatStatsComponent";
import { Product } from "@/interfaces/product_interface";
import TotalCatStatComponent from "./TotalCatStatComponent";
import { CategoryCounts } from "@/interfaces/cat_count_interface";


interface SidebarComponentProps {
  products: Array<Product>;
  categories: CategoryCounts; 
}
const SidebarComponent: React.FC<SidebarComponentProps> = ({products, categories}) => {

  useEffect(() => {
    return () => {

    };
  }, []);
  try {
    const router = useRouter();
  
    return(
      <div className="h-fit bg-gray-50">
        <CatStatsComponent products={products} categories={categories}/>
      </div>
    )
  } catch (err) {
    console.error("Sidebar Component Error: ", err)
  }

};

export default SidebarComponent;