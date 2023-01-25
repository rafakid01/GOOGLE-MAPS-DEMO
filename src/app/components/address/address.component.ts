import { Component, Renderer2 } from '@angular/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { FormBuilder, Validators } from '@angular/forms'
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  options: any = {
    componentRestrictions: { country: "BR" },
  }
  componentsAddress: any;
  userLatitude: any;
  userLongitude: any;
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
    this.componentsAddress = null;
    this.renderer.selectRootElement("#addressInput").focus();
  }

  verifyEmptyInput() {
    let addressHTMLInput: any = document.getElementById("addressInput");
    if (addressHTMLInput?.value == "") {
      this.componentsAddress = null;
    }
  }

  handleAddressChange(address: Address) {
    console.log(address)
    try {
      this.verifyQueryError(address)
    } catch (error) {
      this.throwNewError()
    }
  }

  verifyQueryError(addressToVerify: Address) {
    if (addressToVerify?.address_components?.length == 7 || addressToVerify.address_components[0].types[0] == "route" || addressToVerify.address_components[0].types[0] == "postal_code") {
      this.transferBruteValues(addressToVerify)
    }
    if (addressToVerify?.address_components?.length == 7) {
      this.callWithNumberFunctions();
    } else if (addressToVerify?.address_components[0].types[0] == "route") {
      this.callNoNumberFunctions();
    } else if (addressToVerify.address_components[0].types[0] == "postal_code") {
      this.invertPositionCEP();
      this.callNoNumberFunctions();
    }
    else {
      this.throwNewError()
    }
  }

  transferBruteValues(address: Address) {
    this.componentsAddress = address.address_components;
    this.userLatitude = address.geometry.location.lat();
    this.userLongitude = address.geometry.location.lng();
  }

  throwNewError() {
    let alertHTML = document.getElementById("rewriteAlert");
    alertHTML!.className = "p-1 alert alert-danger rewrite-alert show";
    this.componentsAddress = null;
    throw new Error("Endereço Inválido, insira novamente");
  }

  invertPositionCEP() {
    this.componentsAddress.push(
      this.componentsAddress[0]
    )
    this.componentsAddress.shift();
  }

  callWithNumberFunctions() {
    this.hideElementAlert();
    this.transferFullAddressDataToForm();
    this.enableComplementInput();
    console.log(this.componentsAddress);
  }

  callNoNumberFunctions() {
    this.hideElementAlert();
    this.transferPartialAddressDataToForm();
    this.enableNumberInput();
    this.enableComplementInput();
    console.log(this.componentsAddress);
  }

  hideElementAlert() {
    let alertHTML = document.getElementById("rewriteAlert");
    alertHTML!.className = "hide";
  }

  transferFullAddressDataToForm() {
    this.addressForm.get("street").setValue(this.componentsAddress[1].long_name);
    this.addressForm.get("numberFinal").setValue(this.componentsAddress[0].long_name);
    this.addressForm.get("district").setValue(this.componentsAddress[2].long_name);
    this.addressForm.get("city").setValue(this.componentsAddress[3].long_name);
    this.addressForm.get("state").setValue(this.componentsAddress[4].short_name);
  }

  enableComplementInput() {
    this.addressForm.get("complement").enable();
  }

  enableNumberInput() {
    this.addressForm.get("numberFinal").enable();
  }

  transferPartialAddressDataToForm() {
    this.addressForm.get("street").setValue(this.componentsAddress[0].long_name);
    this.addressForm.get("district").setValue(this.componentsAddress[1].long_name);
    this.addressForm.get("city").setValue(this.componentsAddress[2].long_name);
    this.addressForm.get("state").setValue(this.componentsAddress[3].short_name);
  }
}
