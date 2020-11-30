import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { Observable, of, Subscription} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Vendor } from '../../vendor/vendor';
import { Product } from '../../product/product';
import { POLineItem } from '../po-lineitem';
import { PO } from '../po';
import { BASEURL, PDFURL } from '../../constants';
import { VendorService } from '../../vendor/vendor.service';
import { ProductService } from '../../product/product.service';
import { POService } from '../po.service';

@Component({
  templateUrl: './po-generator.component.html'
})

export class POGeneratorComponent implements OnInit, OnDestroy {
// form
  generatorForm: FormGroup;
  vendorid: FormControl;
  productid: FormControl;
  productqty: FormControl;
  subscription: Subscription;
  products$: Observable<Product[]>; // every vendors's products
  vendors$: Observable<Vendor[]>; // all vendors
  vendorproducts$: Observable<Product[]>; // all products for a particular vendor
  items: Array<POLineItem>; // product items that will be in PO
  selectedproducts: Product[]; // products that being displayed currently in app
  selectedProduct: Product; // the current selected product
  selectedVendor: Vendor; // the current selected vendor
  pickedProduct: boolean;
  pickedVendor: boolean;
  showVendor: boolean; // the vendor will be hidden when Purchase order added
  generated: boolean;
  hasProducts: boolean;
  msg: string;
  url: string;
  total: number;
  sub: number;
  tax: number;
  pono: number;

  constructor(private builder: FormBuilder,
              private vendorService: VendorService,
              private productService: ProductService,
              private poService: POService) {
    this.pickedVendor = false;
    this.pickedProduct = false;
    this.generated = false;
    this.showVendor = true;
    this.url = BASEURL + 'pos';
  } // constructor

  ngOnInit(): void {
    this.msg = '';
    this.vendorid = new FormControl('');
    this.productid = new FormControl('');
    this.productqty = new FormControl('');
    this.generatorForm = this.builder.group({
      productid: this.productid,
      vendorid: this.vendorid,
      productqty: 'eoq'
    });
    this.onPickVendor();
    this.onPickProduct();
    this.onPickVendorProduct();
    this.msg = 'loading vendors and products from server...';
    this.vendors$ = this.vendorService.getAll().pipe(
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          this.msg = `Error: ${error.error.message}`;
        } else {
          this.msg = `Error: ${error.message}`;
        }
        return of([]); // returns an empty array if there's a problem
      })
    );
    this.products$ = this.productService.getAll().pipe(
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          this.msg = `Error: ${error.error.message}`;
        } else {
          this.msg = `Error: ${error.message}`;
        }
        return of([]);
      })
    );
    this.msg = 'server data loaded';
  } // ngOnInit

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  } // ngOnDestroy

  /**
   * onPickVendor - Another way to use Observables, subscribe to the select change event
   * then load specific vendor products for subsequent selection
   */
  onPickVendor(): void {
    this.subscription = this.generatorForm.get('vendorid').valueChanges.subscribe(val => {
      this.selectedProduct = null;
      this.selectedVendor = val;
      this.loadVendorProducts();
      this.pickedProduct = false;
      this.hasProducts = false;
      this.msg = 'choose product for vendor';
      this.pickedVendor = true;
      this.generated = false;
      this.items = []; // array for the po
      this.selectedproducts = []; // array for the details in app html
    });
  } // onPickVendor

  /**
   * onPickProduct - subscribe to the select change event then
   * update array containing items.
   */
  onPickProduct(): void {
    const xSubscr = this.generatorForm.get('productid').valueChanges.subscribe(val => {
      this.selectedProduct = val;
      this.pickedProduct = true;
      // this.loadProductEoq();
      this.generatorForm.patchValue({productqty: 'eoq'}); // set eoq to the default qty
    });
    this.subscription.add(xSubscr); // add it as a child, so all can be destroyed together
  } // onPickProduct

  pickZeroQty(): void{
    const indexPO = this.items.findIndex(it => it.productid === this.selectedProduct.id);
    this.items.splice(indexPO, 1); // delete the product line item
    const indexP = this.selectedproducts.findIndex(it => it.id === this.selectedProduct.id);
    this.selectedproducts.splice(indexP, 1); // delete the product
    this.msg = `All ${this.selectedProduct.name} removed`;

    if (this.items.length === 0) {
      this.hasProducts = false;
      this.msg = `All items were deleted!`;
    }
  }

  onPickVendorProduct(): void {
    const xSubscr = this.generatorForm.get('productqty').valueChanges.subscribe(val => {
      // check if val is eoq or other number
      if (val === 'eoq') {
        val = this.selectedProduct.eoq;
      }

      const findItem = this.items.find(it => it.productid === this.selectedProduct.id);
      const item: POLineItem = {id: 0, poid: 0,
        productid: this.selectedProduct.id, qty: val, price: this.selectedProduct.costprice, productName: '' };

      if (findItem && ((findItem.qty) === val))  { // ignore entry if user choose the same qty again
      }
      else if (findItem &&  (val === 0)) {
        this.pickZeroQty();
      }
      else if (findItem && findItem.qty !== val)  // different qty
      {
        const foundIndex = this.items.findIndex(it => it.productid === this.selectedProduct.id);
        this.items[foundIndex].qty = val;
        this.msg = `${item.qty} ${this.selectedProduct.name}(s) Added`;
      }
      else { // add entry
        this.items.push(item);
        this.selectedproducts.push(this.selectedProduct);
        this.msg = `${item.qty} ${this.selectedProduct.name}(s) Added`;
      }
      if (this.items.length > 0) {
        this.hasProducts = true;
      }
      this.sub = 0.0;
      this.total = 0.0;
      this.tax = 0.0;
      this.items.forEach(pro => this.sub += pro.qty * pro.price);
      this.tax = this.sub * 0.13;
      this.total = this.sub * 1.13;
    });
    this.subscription.add(xSubscr); // add it as a child, so all can be destroyed together
  }

  /**
   * loadVendorProducts - filter for a particular vendor's products
   */
  loadVendorProducts(): void {
    this.vendorproducts$ = this.products$.pipe(
      map( products =>
// map each product in the array and check whether or not it belongs to selected vendor
          products.filter(product => product.vendorid === this.selectedVendor.id)
      )
    );
  } // loadVendorProducts

  /**
   * createPO - create the client side po
   */
  createPO(): void {
    this.generated = false;
    const po: PO = {id: 0, items: this.items, vendorid: this.selectedProduct.vendorid, amount: this.total, podate: null};

    const rSubscr = this.poService.add(po).subscribe(
      payload => { // server should be returning new id
        if (typeof payload === 'number') {
          this.msg = `Purchase Order ${payload} added!`;
          this.pono = payload;
          this.generated = true;
        } else {
          this.msg = 'Purchase Order not added! - server error';
        }
        this.hasProducts = false;
        this.pickedVendor = false;
        this.pickedProduct = false;
        this.showVendor = false;
      },
      err => {
        this.msg = `Error - product not added - ${err.status} - ${err.statusText}`;
      });
    this.subscription.add(rSubscr); // add it as a child, so all can be destroyed together
  } // createPO

  viewPdf(): void {
    window.open(PDFURL + this.pono, '');
  } // viewPdf

} // POGeneratorComponent
