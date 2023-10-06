import React from "react";
import TableCardComponent from "./TableCardComponent";
import { Product } from "@/interfaces/product_interface";

interface TableComponentProps {
  products: Array<Product>;
}

const TableComponent: React.FC<TableComponentProps> = ({ products }) => {
  try {
    return (
      <div className="bg-gray-50 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-sky-600 scrollbar-track-slate-100">
        <h2 className="text-gray-700 p-3 font-bold text-lg w-full sticky top-0 z-[1] bg-gray-50">Scanned products</h2>
        {products.map((product) => (
          <TableCardComponent key={product.id} product={product} />
        ))}
      </div>
    );
  } catch (err) {
    console.error("Table Component Error:", err)
  }
};

export default TableComponent;
