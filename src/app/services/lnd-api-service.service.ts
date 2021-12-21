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

    return this.client.get('https://127.0.0.1:8080/v1/graph', {headers});
  }

}
