export interface Product {
    id:string;
    Shop: string;
    Barcode: string;
    ProductName: string;
    Category: string;
    ImageUrl: string;
    Location: [number, number];
    timestamp?: Date;
    acqTimestamp?: Date;
}

