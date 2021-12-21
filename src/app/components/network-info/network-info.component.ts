import { Component, ViewChild } from '@angular/core';
import { SceneComponent } from 'atft';
import { of } from 'rxjs';
import { LndApiServiceService } from 'src/app/services/lnd-api-service.service';

@Component({
  selector: 'app-network-info',
  templateUrl: './network-info.component.html',
  styleUrls: ['./network-info.component.scss']
})
export class NetworkInfoComponent {

  @ViewChild(SceneComponent) scene!: SceneComponent;

  constructor(public lndApiServiceService: LndApiServiceService) { }

  public lol = of('test')
}
