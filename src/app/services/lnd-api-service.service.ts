import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { macaroon } from './macaroon';
import { LnGraph } from '../types/graph.interface';

@Injectable({
  providedIn: 'root'
})
export class LndApiServiceService {

  constructor(private http: HttpClient) { }

  public getNetworkInfo(): Observable<any>{

    const headers: HttpHeaders = new HttpHeaders({'Grpc-Metadata-macaroon': macaroon});

    return this.http.get('https://127.0.0.1:8080/v1/graph', {headers});
  }

  public getGraphInfo(): Observable<LnGraph>{
    return this.http.get<LnGraph>('assets/graph.json');
  }

}
