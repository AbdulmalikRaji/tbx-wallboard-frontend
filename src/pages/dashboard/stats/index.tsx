import React, { useEffect, useState } from "react";
 // Import the 'useSelector' and 'useDispatch' hooks
import withAuth from "@/helpers/withAuth";
import { useRouter } from 'next/router'
import Layout from "../layout";
import SidebarComponent from "@/components/stats/SidebarComponent";
import { Product } from "@/interfaces/product_interface";
import { Pin } from "@/interfaces/pin_interface";
import { socket } from "@/config/socket";
import dynamic from "next/dynamic";
import TotalCatStatComponent from "@/components/stats/TotalCatStatComponent";
import { Analysis } from "@/interfaces/analysis_interface";
import { CategoryCounts } from "@/interfaces/cat_count_interface";
const MapComponent = dynamic(() => import('@/components/stats/MapComponent'), {
  ssr: false,
});


const StatsDashboard: React.FC = () => { 

 const [localProducts, setLocalProducts] = useState<Product[]>([]);
 socket.on("products", (product) => {

  setLocalProducts(product);
});

  const [localPins, setLocalPins] = useState<Pin[]>([]);
  const [catCounts, setCatCounts] = useState<Analysis[]>([{Title: 'Unique categories in the Last Hour', Value: '0'}, {Title: 'Unique categories in the Last 24 Hours', Value: '0'}],);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCounts>({});


  useEffect(() => {
    socket.connect();
    socket.on("longPins", (newPins) => {
      setLocalPins(newPins);
    });
    socket.on("categoryCounts", (cats) => {
      const categoryCounts: CategoryCounts = {};
    
      cats.forEach((cat: { category: string; count: string; }) => {
        categoryCounts[cat.category] = parseInt(cat.count, 10);
      });
    
      setCategoryCounts(categoryCounts);
    });


    socket.on('catCounts', (counts) => {
      const catCountsArray: Analysis[] = [
        { Title: 'Unique Categories in the last Hour', Value: counts.uniqueCatsLastHour.toString() },
        { Title: 'Unique Categories in the last 24 Hours', Value: counts.uniqueCatsLast24Hours.toString() },
      ];

      setCatCounts(catCountsArray);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  

  return(
    <Layout>
        <div className=" mx-auto ">
        <div className=" bg-slate-100">
        <TotalCatStatComponent catCounts={catCounts} categories={categoryCounts}/>
          <div className="h-max flex flex-col sm:flex-row bg-slate-100">
            <div className="bg-gray-50 drop-shadow-lg sm:w-1/4 p-4 rounded-xl my-4 mx-2">
              <SidebarComponent products={localProducts} categories={categoryCounts}/>
            </div>
            <div className="bg-gray-50 w-auto sm:w-3/4 h-[35rem] p-4 rounded-xl my-4 mx-2 overflow-hidden drop-shadow-lg">
              <h2 className="text-gray-700 font-bold text-lg">Products locations</h2>
              <p className="text-gray-700 mb-2 text-sm">If there are filtered categories, only them will be shown in map</p>
              <MapComponent pins={localPins}/>
            </div>
          </div>
          </div>
        </div>
    </Layout>
  )

};

export default withAuth(StatsDashboard);