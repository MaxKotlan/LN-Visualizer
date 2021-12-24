import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AtftModule } from 'atft';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NetworkInfoComponent } from './components/network-info/network-info.component';
import { GraphEdgeMeshComponent } from './components/graph-edge-mesh/graph-edge-mesh.component';
import { GraphNodeMeshComponent } from './components/graph-node-mesh/graph-node-mesh.component';
import { NodePositionRegistryService } from './services/node-position-registry.service';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { GraphEffects } from './effects/graph.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [
    AppComponent,
    NetworkInfoComponent,
    GraphEdgeMeshComponent,
    GraphNodeMeshComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AtftModule,
    EffectsModule.forRoot([GraphEffects]),
    StoreModule.forRoot(reducers, {
      metaReducers
    }),
    //StoreDevtoolsModule.instrument({})
  ],
  providers: [NodePositionRegistryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
