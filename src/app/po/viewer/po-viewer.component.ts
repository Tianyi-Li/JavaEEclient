import { Component, OnInit, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Form} from '@angular/forms';
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
  templateUrl: './po-viewer.component.html'
})

export class POViewerComponent implements OnInit, OnDestroy {
// form
  generatorForm: FormGroup;
  vendorid: FormControl;
  productid: FormControl;
  productqty: FormControl;
  poid: FormControl;

  subscription: Subscription;
  products$: Observable<Product[]>; // every vendors's products
  vendors$: Observable<Vendor[]>; // all vendors
  vendorpo$: Observable<PO[]>; // certain pos for a particular vendor
  selectedVendor: Vendor; // the current selected vendor
  pickedVendor: boolean;
  showVendor: boolean; // the vendor will be hidden when Purchase order added
  generated: boolean;
  msg: string;
  url: string;
  total: number;
  tax: number;
  pono: number;
  selectedPO: PO;
  hasItems: boolean;
  productName: string;
  grandTotal: number;

  constructor(private builder: FormBuilder,
              private vendorService: VendorService,
              private productService: ProductService,
              private poService: POService) {
    this.pickedVendor = false;
    this.generated = false;
    this.showVendor = true;
    this.url = BASEURL + 'pos';
  } // constructor

  ngOnInit(): void {
    this.msg = '';
    this.productName = '';
    this.vendorid = new FormControl('');
    this.productid = new FormControl('');
    this.productqty = new FormControl('');
    this.poid = new FormControl('');
    this.generatorForm = this.builder.group({
      productid: this.productid,
      vendorid: this.vendorid,
      productqty: 'eoq',
      poid: this.poid
    });
    this.onPickVendor();
    this.onPickPO();
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
      // this.selectedProduct = null;
      this.selectedVendor = val;
      this.loadVendorPOs(val.id);
      this.vendorpo$.subscribe(result => {this.msg = result.length + ' - POs loaded! For ' + this.selectedVendor.name; });
      this.pickedVendor = true;
      this.generated = false;
      // this.selectedproducts = []; // array for the details in app html
    });
  } // onPickVendor

  /**
   * onPickPurchaseOrder - subscribe to the select change event then
   * update array containing items.
   */
  onPickPO(): void {
    const xSubscr = this.generatorForm.get('poid').valueChanges.subscribe(val => {
      this.selectedPO = val;
      this.total = 0.0;
      this.selectedPO.items.map(item => {
        this.total += item.qty * item.price;
        this.products$
          .pipe(map(products => products
            .find(product => product.id === item.productid)))
          .subscribe(pro => {
            item.productName = pro.name;
          });
      });
      this.tax = this.total * .13;
      this.grandTotal = this.total * 1.13;
      this.hasItems = true;
      this.generated = true;
      this.msg = 'Details for PO ' + this.selectedPO.id;
    });
    this.subscription.add(xSubscr); // add it as a child, so all can be destroyed together
  } // onPickPO

  loadVendorPOs(id: number): void {
    this.vendorpo$ = this.poService.getById(id);
  } // loadVendorPOs

  viewPdf(): void {
    window.open(PDFURL + this.selectedPO.id, '');
  } // viewPdf

} // POViewerComponent
