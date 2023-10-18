import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"; // Import the 'useSelector' and 'useDispatch' hooks
import withAuth from "@/helpers/withAuth";
import { useRouter } from 'next/router'
import Layout from "../layout";
import SidebarComponent from "@/components/stats/SidebarComponent";
import { Product } from "@/interfaces/product_interface";
import { Pin } from "@/interfaces/pin_interface";
import { socket } from "@/config/socket";
import dynamic from "next/dynamic";
import { addProduct, selectProducts } from "@/store/productSlice"; 
import { RootState} from "@/store/store"; 
import { addLongPin, addPin, removeLongPin, removePin, selectLongPins, selectPins } from "@/store/pinSlice";
import {v4 as uuidv4} from 'uuid';
import { filterExpiredPins, updateProducts} from "@/services/updateProductsService";
import { updateStats } from "@/services/updateStatsService";
import TotalCatStatComponent from "@/components/stats/TotalCatStatComponent";
import { Analysis } from "@/interfaces/analysis_interface";
const MapComponent = dynamic(() => import('@/components/stats/MapComponent'), {
  ssr: false,
});

const MAX_PRODUCTS = 60;
const PIN_TIMEOUT_SHORT = 3000;
const PIN_TIMEOUT_LONG = 30000;

const StatsDashboard: React.FC = () => { 
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const pins = useSelector(selectLongPins);
  const [catCounts, setCatCounts] = useState<Analysis[]>([{Title: 'Unique categories in the Last Hour', Value: '0'}, {Title: 'Unique categories in the Last 24 Hours', Value: '0'}],);



  useEffect(() => {
    socket.connect();
    socket.on("products", (product)=> {
      updateStats(product,dispatch)
      updateProducts(product,pins,dispatch)
    });

    socket.on('catCounts', (counts) => {
      const catCountsArray: Analysis[] = [
        { Title: 'Unique Categories in the last Hour', Value: counts.uniqueCatsLastHour.toString() },
        { Title: 'Unique Categories in the last 24 Hours', Value: counts.uniqueCatsLast24Hours.toString() },
      ];
      console.log(catCountsArray)
      setCatCounts(catCountsArray);
    });

    return () => {
      socket.off("products", updateProducts);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    filterExpiredPins(pins,dispatch)
  }, [products]);
  

  return(
    <Layout>
        <div className="h-screen mx-auto ">
        <div className=" bg-slate-100">
        <TotalCatStatComponent catCounts={catCounts}/>
          <div className="h-max flex flex-col sm:flex-row bg-slate-100">
            <div className="bg-gray-50 drop-shadow-lg sm:w-1/4 p-4 rounded-xl my-4 mx-2">
              <SidebarComponent products={products}/>
            </div>
            <div className="bg-gray-50 w-auto sm:w-3/4 h-fit p-4 rounded-xl my-4 mx-2 overflow-hidden drop-shadow-lg">
              <h2 className="text-gray-700 font-bold text-lg">Products locations</h2>
              <p className="text-gray-700 mb-2 text-sm">If there are filtered categories, only them will be shown in map</p>
              <MapComponent pins={pins}/>
            </div>
          </div>
          </div>
        </div>
    </Layout>
  )

};

export default withAuth(StatsDashboard);