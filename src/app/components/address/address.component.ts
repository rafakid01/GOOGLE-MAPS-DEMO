import { Component } from '@angular/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent {
  options: any = {
    componentRestrictions: { country: "BR" }
  }
  initAddress: any;
  fullAddress: any;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  addressForm = this.formBuilder.group({
    numberQuery: ["", [Validators.required]],
    street: [""],
    numberFinal: [""],
    complement: [""],
    district: [""],
    city: [""],
    state: [""],
  })

  handleAddressChange(address: Address) {
    this.initAddress = address.address_components;
  }

  getFullAddress() {
    if (this.initAddress?.length == 6) {
      this.insertNumberInAddress();
    }
    this.transformFullAddress();
  }

  insertNumberInAddress() {
    this.initAddress.shift();
    this.initAddress.unshift({
      long_name: this.addressForm.get("numberQuery")?.value,
      short_name: this.addressForm.get("numberQuery")?.value,
      types: ["street_number"]
    });
  }

  transformFullAddress() {
    this.fullAddress = this.initAddress;
  }

  getAddressData() {
    this.getFullAddress();
    console.log(this.fullAddress);
    console.log(this.addressForm);
  }
}
