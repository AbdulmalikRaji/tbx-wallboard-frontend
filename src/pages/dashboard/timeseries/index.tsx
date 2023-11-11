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
import { Chart } from 'react-google-charts';

// const GoogleBarChartComponent = () => {
//   const data = [
//     ['City', 'Population'],
//     ['Tokyo', 37750000],
//     ['Delhi', 21753486],
//     ['Shanghai', 23019148],
//     ['Sao Paulo', 21066245],
//   ];

//   const options = {
//     title: 'Population and Area of Largest Cities',
//     chartArea: { width: '50%' },
//     hAxis: {
//       title: 'Population',
//       minValue: 0,
//     },
//     vAxis: {
//       title: 'City',
//     },
//   };

//   return (
//     <Chart
//       chartType="BarChart"
//       width="100%"
//       height="400px"
//       data={data}
//       options={options}
//     />
//   );
// };

// export default GoogleBarChartComponent;


const timeWindowInSeconds = 10;


const TimeSeriesDashboard: React.FC= () => { 
 // const dispatch = useDispatch();
 // const products = useSelector(selectProducts);
  //const pins = useSelector(selectPins);
  const [localPins, setLocalPins] = useState<Pin[]>([]);
  const [thisSecond, setThisSecond] = useState<number>(0);
  const [productsThisSecond, setProductsThisSecond] = useState<number>(0);

  const [data, setData] = useState(
    [["Time","Products per second"],
    ["0",0],
   ]
    );
  const options = {
    title: 'Number of products each second',
    chartArea: { width: '70%'},
    hAxis: {
      title: 'Time',
      minValue: 0,
    },
    vAxis: {
      title: 'Products per second',
    },
  };


  useEffect(() => {

    socket.connect();
    socket.on("shortPins", (newPins) => {
      setLocalPins(newPins);
    });
    socket.on("productsThisSecond", (productsThisSecond) => {
      setData((prevData) => [prevData[0], ...productsThisSecond]);
    });

    return () => {
      socket.off("shortPins", updateProducts);
      socket.off("productsThisSecond", updateProducts);
      socket.disconnect();
    };
  }, []);

  return(
    <Layout>
        <div className="h-screen mx-auto ">
          <div className="h-full flex flex-col sm:flex-row bg-slate-100 text-white">
            <div className="bg-gray-50 w-auto sm:w-1/2 h-[35rem] p-4 rounded-xl my-4 mx-2 overflow-hidden drop-shadow-lg">
                 <Chart
                  chartType="ColumnChart"
                  width="100%"
                  height="100%"
                  data={data}
                  options={options}
                />
            </div>
            <div className="bg-gray-50 w-auto sm:w-1/2 h-[35rem] p-4 rounded-xl my-4 mx-2 overflow-hidden drop-shadow-lg">
              <h2 className="text-gray-700 font-bold text-lg">Products locations</h2>
              <MapComponent pins={localPins} />
            </div>
          </div>
        </div>
    </Layout>
  )

};

export default withAuth(TimeSeriesDashboard);