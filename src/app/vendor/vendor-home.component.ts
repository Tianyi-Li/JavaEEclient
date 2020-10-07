import { Component, OnInit } from '@angular/core';
import { Vendor } from './vendor';
import { VendorService } from './vendor.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-casestudy',
  templateUrl: 'vendor-home.component.html'
})
export class VendorHomeComponent implements OnInit {
  vendors$: Observable<Vendor[]>;
  vendor: Vendor;
  msg: string;
  hideEditForm: boolean;
  todo: string;
  constructor(public vendorService: VendorService) {
    this.hideEditForm = true;
  } // constructor

  ngOnInit(): void {
    this.msg = `Vendor's loaded`;
    this.vendors$ = this.vendorService.load().pipe(
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          this.msg = `Error: ${error.error.message}`;
        } else {
          this.msg = `Error: ${error.message}`;
        }
        return of([]);
      })
    );
  } // ngOnInit

  select(vendor: Vendor): void {
    this.todo = 'update';
    this.vendor = vendor;
    this.msg = `${vendor.name} selected`;
    this.hideEditForm = !this.hideEditForm;
  } // select

  /**
   * cancelled - event handler for cancel button
   */
  cancel(msg?: string): void {
    if (msg) {
      this.msg = 'Operation cancelled';
    }
    this.hideEditForm = !this.hideEditForm;
  } // cancel

  /**
   * update - send changed update to service update local array
   */
  update(vendor: Vendor): void {
    this.vendorService.update(vendor).subscribe( payload => {
        if (payload.id > 0) {
          this.msg = `Vendor ${vendor.id} updated!`;
        } else {
          this.msg = 'Vendor not updated! - server error';
        }
        this.hideEditForm = !this.hideEditForm;
      },
      err => {
        this.msg = `Error - vendor not updated - ${err.status} - ${err.statusText}`;
      });
  } // update
} // VendorHomeComponent
