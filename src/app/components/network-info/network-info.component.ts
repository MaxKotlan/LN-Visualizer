import { Component, OnInit, ViewChild } from '@angular/core';
import { RendererService, SceneComponent } from 'atft';
import { of, take } from 'rxjs';
import { LndApiServiceService } from 'src/app/services/lnd-api-service.service';
import * as THREE from 'three';
import { Scene } from 'three';

@Component({
  selector: 'app-network-info',
  templateUrl: './network-info.component.html',
  styleUrls: ['./network-info.component.scss']
})
export class NetworkInfoComponent implements OnInit {

  @ViewChild(SceneComponent) scene!: SceneComponent;

   constructor(public lndApiServiceService: LndApiServiceService, public rendererService: RendererService) { }

   public lol = of('lol');

  ngOnInit(): void {
    // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    // const cube = new THREE.Mesh( geometry, material );
    //this.rendererService.add(cube);
  }

  ngAfterViewInit(){
    console.log(this.rendererService)
    console.log(this.scene);
  }

}
