/**
 * POLineItem - container class for expense report item
 */
export interface POLineItem {
  id: number;
  poid: number;
  productid: string;
  qty: number;
  price: number;
  productName: string;
}
