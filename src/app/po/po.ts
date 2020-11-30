import { POLineItem } from './po-lineitem';
/**
 * PO - interface for Purchase Order
 */
export interface PO {
  id: number;
  vendorid: number;
  amount: number;
  items: POLineItem[];
  podate: Date;
}
