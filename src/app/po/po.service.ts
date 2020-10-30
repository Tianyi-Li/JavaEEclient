import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {GenericHttpService} from '../generic-http.service';
import {PO} from './po';
import {BASEURL} from '../constants';


@Injectable({
  providedIn: 'root'
})
export class POService extends GenericHttpService<PO> {
  constructor(public http: HttpClient) {
    super(http, `${BASEURL}/api/pos`);
  }
}
