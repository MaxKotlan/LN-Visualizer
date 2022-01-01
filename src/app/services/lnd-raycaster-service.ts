import {ElementRef, Injectable, OnDestroy} from '@angular/core';
import { AbstractCamera, AbstractObject3D, RaycasterEvent } from 'atft';
import * as THREE from 'three';

interface NearestIntersection {
  intersection: THREE.Intersection | undefined | null;
  object: THREE.Object3D | null;
  face: THREE.Face | null | undefined;
}

/*
Need to change the behavior to get coordinates in world space
*/
@Injectable()
export class LndRaycasterService implements OnDestroy {

  private raycaster = new THREE.Raycaster();
  private selected: THREE.Object3D | undefined | null;
  private enabled = false;
  private camera: AbstractCamera<any> | undefined;
  private groups: Array<AbstractObject3D<any>> = [];
  private paused = false;
  private canvas: ElementRef | undefined;


  constructor() {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
  }

  ngOnDestroy() {
    this.disable();
    this.unsubscribe();
  }

  private subscribe() {
    this.canvas?.nativeElement.addEventListener('mousemove', this.onMouseMove);
    this.canvas?.nativeElement.addEventListener('click', this.onClick);
    this.canvas?.nativeElement.addEventListener('touchstart', this.onTouchStart);
  }

  private unsubscribe() {
    // console.log('unsubscribe raycaster');
    this.canvas?.nativeElement.removeEventListener('mousemove', this.onMouseMove);
    this.canvas?.nativeElement.removeEventListener('click', this.onClick);
    this.canvas?.nativeElement.removeEventListener('touchstart', this.onTouchStart);
  }

  public enable() {
    this.enabled = true;
  }

  public disable() {
    this.enabled = false;
  }

  public pause() {
    this.paused = true;
  }

  public resume() {
    this.paused = false;
  }


  get isEnabled() {
    return this.enabled;
  }

  public setCanvasObject(canvas: ElementRef) {
    // console.log('Add camera to raycaster', camera);
    this.canvas = canvas;
    this.subscribe();
  }

  public setCamera(camera: AbstractCamera<any>) {
    // console.log('Add camera to raycaster', camera);
    this.camera = camera;
  }

  public addGroup(group: AbstractObject3D<any>) {
    // console.log('RaycasterService.addGroup', group.name, group);
    this.groups.push(group);
  }

  private onMouseMove(event: any) { 
    // if (!this.isReady()) {
    //   return;
    // }
    // //event.preventDefault();
    // const i = this.getFirstIntersectedGroup(event.layerX, event.layerY);
    // if (!this.selected || this.selected !== i?.object) {
    //   if (this.selected) {
    //     this.selected.dispatchEvent({type: RaycasterEvent.mouseExit});
    //     this.selected = null;
    //   }
    //   if (i && i.object) {
    //     this.selected = i.object;
    //     this.selected.dispatchEvent({type: RaycasterEvent.mouseEnter,  ...i});
    //   }
    // }

  }

  private onClick(event: any) {
    if (!this.isReady(true)) {
      return;
    }
    //event.preventDefault();
    const i = this.getFirstIntersectedGroup(event.layerX, event.layerY);
    if (i && i.object) {
      i.object.dispatchEvent({type: RaycasterEvent.click, ...i});
    }
  }

  private onTouchStart(event: TouchEvent) {
    // console.log(event);
    if (!this.isReady()) {
      return;
    }
    //event.preventDefault();
    const i = this.getFirstIntersectedGroup(event.touches[0].clientX, event.touches[0].clientY);
    if (i && i.object) {
      i.object.dispatchEvent({type: RaycasterEvent.click, ...i});
    }
  }

  private isReady(ignorePaused?: boolean) {
    return this.enabled
      && (ignorePaused || !this.paused)
      && this.camera
      && this.camera.camera
      && this.groups
      && this.groups.length > 0;
  }

  private getFirstIntersectedGroup(x: any, y: any): THREE.Intersection | null {
    x = (x / window.innerWidth) * 2 - 1;
    y = -(y / window.innerHeight) * 2 + 1;
    const mouseVector = new THREE.Vector3(x, y, 0.5);
    this.raycaster.setFromCamera(mouseVector, this.camera?.camera);

    let nearestIntersection: THREE.Intersection | undefined | null;
    for (let k = 0; k < this.groups.length; k++) {
      const i = this.groups[k].getObject();
      const intersection = this.raycaster.intersectObject(i, true);
      //console.log('Hit', intersection);
      if (intersection.length > 0 && (!nearestIntersection || nearestIntersection.distance > intersection[0].distance)) {
        nearestIntersection = intersection[0];
      }
    }
    if (nearestIntersection) return nearestIntersection;
    return null;
  }

}