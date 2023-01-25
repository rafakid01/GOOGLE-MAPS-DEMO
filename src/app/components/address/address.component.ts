import { Component, Renderer2 } from '@angular/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { FormBuilder, Validators } from '@angular/forms'
import { OnInit } from '@angular/core';
import { Call } from '@angular/compiler';

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
  addressForm: any;
  formattedAddress: string;

  constructor(
    private formBuilder: FormBuilder,
    private renderer: Renderer2
  ) {
    this.formattedAddress = "";
  }

  ngOnInit() {
    this.createInitForm()
  }

  createInitForm() {
    this.addressForm = this.formBuilder.group({
      numberQuery: [{ value: "", disabled: true }, [Validators.required]],
      street: [{ value: "", disabled: true }, [Validators.required]],
      numberFinal: [{ value: "", disabled: true }, [Validators.required]],
      complement: [{ value: "", disabled: true }],
      district: [{ value: "", disabled: true }, [Validators.required]],
      city: [{ value: "", disabled: true }, [Validators.required]],
      state: [{ value: "", disabled: true }, [Validators.required]],
    })
  }

  cleanAddressInput() {
    let addressHTMLInput: any = document.getElementById("addressInput");
    addressHTMLInput.value = "";
    this.fullAddress = null;
    this.renderer.selectRootElement("#addressInput").focus();
  }

  verifyEmptyInput() {
    let addressHTMLInput: any = document.getElementById("addressInput");
    if (addressHTMLInput?.value == "") {
      this.fullAddress = null;
    }
  }

  handleAddressChange(address: Address) {
    this.verifyQueryError(address);
  }

  verifyQueryError(addressToVerify: Address) {
    if (addressToVerify.address_components.length == 7) {
      this.formattedAddress = addressToVerify.formatted_address;
      this.fullAddress = null;
      this.fullAddress = addressToVerify.address_components;
      this.callFinalizeFunctions();
    } else {
      this.throwNewError();
    }
  }

  throwNewError() {
    this.fullAddress = null;
    throw new Error("Endereço Inválido, insira novamente");
  }

  callFinalizeFunctions() {
    this.transferAddressDataToForm();
    this.enableComplementInput();
    console.log(this.fullAddress)
  }

  transferAddressDataToForm() {
    this.addressForm.get("street").setValue(this.fullAddress[1].long_name)
    this.addressForm.get("numberFinal").setValue(this.fullAddress[0].long_name)
    this.addressForm.get("district").setValue(this.fullAddress[2].long_name)
    this.addressForm.get("city").setValue(this.fullAddress[3].long_name)
    this.addressForm.get("state").setValue(this.fullAddress[4].short_name)
  }

  enableComplementInput() {
    this.addressForm.get("complement").enable();
  }
}
