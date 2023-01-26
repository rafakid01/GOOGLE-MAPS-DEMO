import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddressComponent } from './components/address/address.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { DeliveryDistanceComponent } from './components/delivery-distance/delivery-distance.component';

@NgModule({
  declarations: [
    AppComponent,
    AddressComponent,
    DeliveryDistanceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GooglePlaceModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
