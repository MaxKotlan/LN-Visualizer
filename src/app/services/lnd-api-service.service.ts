import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LnGraph } from '../types/graph.interface';
import { webSocket } from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})
export class LndApiServiceService {

  constructor(private http: HttpClient) {
    this.webSocket();
  }

  public getNetworkInfo(): Observable<any>{

    // const headers: HttpHeaders = new HttpHeaders({'Grpc-Metadata-macaroon': macaroon});

    return this.http.get('http://localhost:1678/');
  }

  public getGraphInfo(): Observable<LnGraph>{
    //return this.http.get<LnGraph>('assets/graph-min.json');
    return this.http.get<LnGraph>('http://localhost:1678/');
  }
  
  public webSocket(): Observable<any>{
    const subject = webSocket('ws://localhost:8090');
    subject.asObservable().subscribe(
      msg => console.log('message received: ' + msg), // Called whenever there is a message from the server.
      err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      () => console.log('complete') // Called when connection is closed (for whatever reason).
    );
    return subject;
  }

}
