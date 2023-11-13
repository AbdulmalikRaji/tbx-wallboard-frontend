import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import withAuth from "@/helpers/withAuth";
import TableComponent from "@/components/main/TableComponent";
import dynamic from "next/dynamic";
import { socket } from "@/config/socket";
import { Analysis } from "@/interfaces/analysis_interface";
import Layout from "../layout";
import { Product } from "@/interfaces/product_interface";
import { Pin } from "@/interfaces/pin_interface";
import AnalysisComponent from "@/components/main/AnalysisComponent";
import {
  updateProducts
} from "@/services/updateProductsService";

const MapComponent = dynamic(() => import("@/components/main/MapComponent"), {
  ssr: false,
});


const MainDashboard: React.FC = () => {

  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [localPins, setLocalPins] = useState<Pin[]>([]);

  const [productCounts, setProductCounts] = useState<Analysis[]>([{Title: 'Products Sent Last Hour', Value: '0'}, {Title: 'Products Sent Last 24 Hours', Value: '0'}],);
  const [showTable, setShowTable] = useState<boolean>(true);


  useEffect(() => {
    socket.connect();
    socket.on("products", (product) => {
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
