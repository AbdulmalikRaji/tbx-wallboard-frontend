import { Product } from "@/interfaces/product_interface";
import { useRouter } from "next/router";
import { useEffect } from "react";


interface TimeSeriesGraphComponentProps {
    products: Array<Product>;
  }
  const SidebarComponent: React.FC<TimeSeriesGraphComponentProps> = ({products}) => {
 
      const router = useRouter();
      useEffect(() => {
        return () => {
    
        };
      }, []);
      try {
    
      return(
        <div className="h-full bg-gray-50">
          
        </div>
      )
    } catch (err) {
      console.error("Timeseries Graph Component Error: ", err)
    }
  
  };
  
  export default SidebarComponent;