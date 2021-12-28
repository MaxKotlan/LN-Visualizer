import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LnGraph } from '../types/graph.interface';

@Injectable({
  providedIn: 'root'
})
export class LndApiServiceService {

  constructor(private http: HttpClient) { }

  public getNetworkInfo(): Observable<any>{

    // const headers: HttpHeaders = new HttpHeaders({'Grpc-Metadata-macaroon': macaroon});

    return this.http.get('http://localhost:1678/');
  }

  public getGraphInfo(): Observable<LnGraph>{
    //return this.http.get<LnGraph>('assets/graph-min.json');
    return this.http.get<LnGraph>('http://localhost:1678/');
  }

}
