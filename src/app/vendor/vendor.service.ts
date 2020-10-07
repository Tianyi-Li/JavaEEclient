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
    this.resourceURL = `${BASEURL}api/vendors`;
  } // constructor
  /**
   * Retrieves the vendors collection, parses the JSON, then returns the array to a subscriber
   */
  load(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(this.resourceURL);
  } // load

  /**
   * Update an vendor on the server using http put, server returns updated vendor
   */
  update(vendor: Vendor): Observable<Vendor> {
    return this.http.put<Vendor>(`${this.resourceURL}`, vendor);
  } // update
}
