import React, { useEffect, useState } from "react";
import withAuth from "@/helpers/withAuth";
import { useRouter } from 'next/router'
import FilterComponent from "./FilterComponent";
import CatStatsComponent from "./CatStatsComponent";
import { Product } from "@/interfaces/product_interface";
import TotalCatStatComponent from "./TotalCatStatComponent";


interface SidebarComponentProps {
  products: Array<Product>;
}
const SidebarComponent: React.FC<SidebarComponentProps> = ({products}) => {
  try {
    const router = useRouter();
    useEffect(() => {
      return () => {
  
      };
    }, []);
  
    return(
      <div className="h-full bg-gray-50">
        <CatStatsComponent products={products}/>
      </div>
    )
  } catch (err) {
    console.error("Sidebar Component Error: ", err)
  }

};

export default SidebarComponent;