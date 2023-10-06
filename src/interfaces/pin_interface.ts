export interface Pin {
    id:string;
    productId:string;
    Barcode: string;
    X: number;
    Y: number;
    Category:string;
    DotColor?:string;
    ProductName:string;
    expirationTime: number;
    timeoutId: NodeJS.Timeout | null | undefined;
}