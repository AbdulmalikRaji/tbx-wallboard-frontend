import React, { useEffect, useState} from "react";
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
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
const MapComponent = dynamic(() => import('@/components/main/MapComponent'), {
  ssr: false,
});



const timeWindowInSeconds = 10;


const StatsDashboard: React.FC= () => { 
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const pins = useSelector(selectPins);
  const [data, setData] = useState([{ x: 0, y: 0 }]);
  const [layout, setLayout] = useState({
    title: 'Real-Time Product Time Series',
    xaxis: {
      title: 'Time (seconds)',
      range: [0, timeWindowInSeconds],
    },
    yaxis: {
      title: 'Products per second',
    },
  });


  useEffect(() => {
    let currentSecond = 0;

    // Start a timer to reset Y-axis every second
    const timer = setInterval(() => {
      currentSecond += 1;
      // Reset Y-axis to zero at the beginning of each second
      setLayout((prevLayout) => ({
        ...prevLayout,
        xaxis: {
          ...prevLayout.xaxis,
          range: [currentSecond - timeWindowInSeconds, currentSecond],
        },
      }));
      setData((prevData) => [...prevData, { x: currentSecond, y: 0 }]);
    }, 1000);

    socket.connect();
    socket.on("products", (product)=> {
      product.timestamp = new Date().getSeconds()
      updateStats(product,dispatch)
      updateProducts(product,pins,dispatch)
      setData((prevData) => [
        ...prevData,
        { x: prevData[prevData.length - 1].x, y: prevData[prevData.length - 1].y + 1 },
      ]);
    });

    return () => {
      clearInterval(timer);
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
          <div className="h-full flex flex-col sm:flex-row bg-slate-100 text-white">
            <div className="bg-gray-50 w-auto sm:w-1/2 h-fit p-4 rounded-xl my-4 mx-2 overflow-hidden drop-shadow-lg">
            <Plot className="w-full"
              data={[
                {
                  type: 'scatter',
                  mode: 'lines+markers',
                  x: data.map((point) => point.x),
                  y: data.map((point) => point.y),
                },
              ]}
              layout={layout}
            />
            </div>
            <div className="bg-gray-50 w-auto sm:w-1/2 h-3/4 p-4 rounded-xl my-4 mx-2 overflow-hidden drop-shadow-lg">
              <h2 className="text-gray-700 font-bold text-lg">Products locations</h2>
              <div className="h-[42rem] h-max-min">
                <MapComponent pins={pins} />
              </div>
            </div>
          </div>
        </div>
    </Layout>
  )

};

export default withAuth(StatsDashboard);