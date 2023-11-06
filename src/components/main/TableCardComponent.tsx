import React from "react";
import { Product } from "@/interfaces/product_interface";

interface TableCardComponentProps {
  product: Product;
}

const TableCardComponent: React.FC<TableCardComponentProps> = ({ product }) => {
  try {
    return (
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4  m-3 p-3 rounded-xl bg-slate-100 drop-shadow-md">
        {/* <div className="w-16 sm:w-24 md:w-32">
          <img src={product.ImageUrl} alt={product.ProductName} className="w-full h-auto rounded-xl" />
        </div> */}
        <div>
  <h4 className="text-gray-700 text-xs sm:text-sm md:text-base font-semibold">{product.ProductName}</h4>
  <h6 className="text-gray-700 text-xxs sm:text-xs">{product.Category}</h6>
  <p className="text-gray-500 line-clamp-1 text-xxs sm:text-xs">Barcode: {product.Barcode}</p>
  <p className="text-gray-500 block text-xxs sm:text-xs">Shop: {product.Shop}</p>
  <p className="text-gray-500 text-xxs sm:text-xs">Location: {product.Location[0]}, {product.Location[1]}</p>
</div>

      </div>
    );
  } catch (err) {
    console.error("TableCard Component Error:", err)
  }
};

export default TableCardComponent;
