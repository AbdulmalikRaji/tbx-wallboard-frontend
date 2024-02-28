import React, { useEffect, useState} from "react";

import withAuth from "@/helpers/withAuth";
import { useRouter } from 'next/router'
import Layout from "../layout";

import { Pin } from "@/interfaces/pin_interface";
import { socket } from "@/config/socket";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
const MapComponent = dynamic(() => import('@/components/timeseries/MapComponent'), {
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

  const [localPins, setLocalPins] = useState<Pin[]>([]);


  const [data, setData] = useState(
    [["Time","Products per 3 seconds"],
    ["0",0],
   ]
    );
  const options = {
    title: 'Number of products every 3 seconds',
    chartArea: { width: '65%'},
    hAxis: {
      title: 'Time',
      minValue: 0,
      slantedText: true, // Set to true to enable slanted text
      slantedTextAngle: 45, // Specify the angle of the slanted text
    },
    vAxis: {
      title: 'Products per 3 seconds',
      viewWindow: {
        min: 0,
        max: 100,
      },
    },
  };


  useEffect(() => {

    socket.connect();
    socket.on("longPins", (newPins) => {
      setLocalPins(newPins);
    });
    socket.on("productsThisSecond", (productsThisSecond) => {
      setData((prevData) => [prevData[0], ...productsThisSecond]);
    });

    return () => {
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