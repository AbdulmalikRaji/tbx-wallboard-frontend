import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import withAuth from "@/helpers/withAuth";
import TableComponent from "@/components/main/TableComponent";
import dynamic from "next/dynamic";
import { socket } from "@/config/socket";
import { addProduct, selectProducts } from "@/store/productSlice";
import { addPin, removePin, selectPins } from "@/store/pinSlice";
import { addLongPin } from "@/store/pinSlice";
import { Analysis } from "@/interfaces/analysis_interface";
import Layout from "../layout";
import { Product } from "@/interfaces/product_interface";
import { Pin } from "@/interfaces/pin_interface";
import AnalysisComponent from "@/components/main/AnalysisComponent";
import {
  filterExpiredPins,
  updateProducts,
} from "@/services/updateProductsService";
import { updateStats } from "@/services/updateStatsService";
import { title } from "process";
const MapComponent = dynamic(() => import("@/components/main/MapComponent"), {
  ssr: false,
});


const MainDashboard: React.FC = () => {
  const dispatch = useDispatch();
  //const products = useSelector(selectProducts);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [localPins, setLocalPins] = useState<Pin[]>([]);
//  const pins = useSelector(selectPins);
// Assuming `products` is an array of objects of type `Product`
// const uniqueProducts = Array.from(
//   new Set(products.map((product: Product) => JSON.stringify(product))),
//   (str: string) => JSON.parse(str) as Product
// ) as Product[];

  const [productCounts, setProductCounts] = useState<Analysis[]>([{Title: 'Products Sent Last Hour', Value: '0'}, {Title: 'Products Sent Last 24 Hours', Value: '0'}],);
  const [uniqueLocations, setUniqueLocations] = useState<number>(0);
  const [showTable, setShowTable] = useState<boolean>(true);
  const [mapPins, setMapPins] = useState<Pin[]>([]);

  useEffect(() => {
    socket.connect();
    socket.on("products", (product) => {
      //updateStats(product, dispatch);
    //  updateProducts(product, pins, dispatch);
      setLocalProducts(product);
    });
    socket.on("shortPins", (newPins) => {
      setLocalPins(newPins);
    });
    socket.on('productCounts', (counts) => {
      const productCountsArray: Analysis[] = [
        { Title: 'Products Sent Last Hour', Value: counts.productsSentLastHour.toString() },
        { Title: 'Products Sent Last 24 Hours', Value: counts.productsSentLast24Hours.toString() },
      ];
      console.log(productCountsArray)
      setProductCounts(productCountsArray);
    });

    return () => {
      socket.off("products", updateProducts);
      socket.disconnect();
    };
  }, []);

  // setInterval(filterExpiredPins,1000,pins,dispatch)

  // setInterval(()=>{
  // //  filterExpiredPins(pins,dispatch)
  // },1000)

  const handleToggleTable = () => {
    setShowTable((prevValue) => !prevValue);
  };

  return (
    <Layout>
      <div className="h-screen mx-auto bg-slate-100 bg-scroll">
        <div className="flex flex-col sm:flex-row h-screen">
          <div
            className={`flex overflow sm:overflow-hidden rounded-lg mx-2 my-2 transition-all duration-300 ${
              showTable ? "min-h-screen sm:min-h-0 sm:h-auto w-full sm:w-1/4" : "h-auto w-fit"
            }`}
          >
            
            {showTable && <TableComponent products={localProducts} />}
            <button
              onClick={handleToggleTable}
              className="flex px-4 bg-slate-200 text-gray-700 w-0.5 h-full justify-center items-center"
            >
              <span>{showTable ? "<" : ">"}</span>
            </button>
          </div>
          <div
            className={`flex flex-col ${
              showTable ? "w-full sm:w-3/4" : "w-full"
            }`}
          >
            <div className="m-4">
              <AnalysisComponent productCounts={productCounts}/>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 overflow-hidden m-2 drop-shadow-md h-[35rem]">
              <h2 className="text-gray-700 mb-2 font-bold text-lg">
                Products locations
              </h2>
                <MapComponent pins={localPins} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(MainDashboard);
