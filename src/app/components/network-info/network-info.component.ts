import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { LndApiServiceService } from 'src/app/services/lnd-api-service.service';

@Component({
  selector: 'app-network-info',
  templateUrl: './network-info.component.html',
  styleUrls: ['./network-info.component.scss']
})
export class NetworkInfoComponent implements OnInit {

  constructor(public lndApiServiceService: LndApiServiceService) { }

  public lol = this.lndApiServiceService.getNetworkInfo().pipe(take(1));

  ngOnInit(): void {
  }

}
