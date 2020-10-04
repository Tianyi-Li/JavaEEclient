import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASEURL } from '../constants';
import { Vendor } from './vendor';
import { Observable } from 'rxjs';
// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class VendorService {
  resourceURL: string;
  status: string;
  constructor(public http: HttpClient) {
    this.resourceURL = `${BASEURL}vendors`;
  } // constructor
  /**
   * Retrieves the vendors collection, parses the JSON, then returns the array to a subscriber
   */
  load(): Observable<any> {
    return this.http.get(this.resourceURL);
  } // load
}
