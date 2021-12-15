import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { macaroon } from './macaroon';

@Injectable({
  providedIn: 'root'
})
export class LndApiServiceService {

  constructor(private client: HttpClient) { }

  public getNetworkInfo(): Observable<any>{

    const headers: HttpHeaders = new HttpHeaders({'Grpc-Metadata-macaroon': macaroon});

    return this.client.get('api/v1/graph/node/03fb822818be083e0a954db85257a2911a3d55458b8c1ea4124b157e865a836d12', {headers});
  }

}
