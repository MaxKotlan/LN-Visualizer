import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AtftModule } from 'atft';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NetworkInfoComponent } from './components/network-info/network-info.component';

@NgModule({
  declarations: [
    AppComponent,
    NetworkInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AtftModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
