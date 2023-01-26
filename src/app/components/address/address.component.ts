import { Component, Renderer2 } from '@angular/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { FormBuilder, Validators } from '@angular/forms'
import { OnInit } from '@angular/core';
import { DistanceCalculeService } from 'src/app/services/distance-calcule.service';

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
    private renderer: Renderer2,
    private distanceService: DistanceCalculeService
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
    });
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
    console.log(address);
    try {
      this.disableAllControls();
      this.verifyQueryError(address);
    } catch (error) {
      this.throwNewError();
    }
  }

  disableAllControls() {
    this.addressForm.get("street").disable();
    this.addressForm.get("numberFinal").disable();
    this.addressForm.get("complement").disable();
    this.addressForm.get("city").disable();
    this.addressForm.get("state").disable();
  }

  verifyQueryError(addressToVerify: Address) {

    let objectFirstIndexValue = addressToVerify?.address_components[0].types[0];

    // if (objectFirstIndexValue == "street_number" || objectFirstIndexValue == "route" || objectFirstIndexValue == "postal_code") {
    this.transferBruteValues(addressToVerify)
    // }
    if (objectFirstIndexValue == "street_number") {
      this.callWithNumberFunctions();
    } else if (objectFirstIndexValue == "route") {
      this.callLeftNumberFunctions();
    } else if (objectFirstIndexValue == "postal_code") {
      this.invertPositionCEP();
      this.callLeftNumberFunctions();
    }
    else {
      this.throwNewError()
    }
  }

  transferBruteValues(address: Address) {
    this.componentsAddress = address.address_components;
    this.userLatitude = address.geometry.location.lat();
    this.userLongitude = address.geometry.location.lng();
    console.log(this.userLatitude);
    console.log(this.userLongitude);
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

  callLeftNumberFunctions() {
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
    this.resetForm();
    this.addressForm.get("street").setValue(this.componentsAddress[1].long_name);
    this.addressForm.get("numberFinal").setValue(this.componentsAddress[0].long_name);
    this.addressForm.get("district").setValue(this.componentsAddress[2].long_name);
    this.addressForm.get("city").setValue(this.componentsAddress[3].long_name);
    this.addressForm.get("state").setValue(this.componentsAddress[4].short_name);
  }

  resetForm() {
    this.addressForm.get("street").setValue("");
    this.addressForm.get("numberFinal").setValue("");
    this.addressForm.get("district").setValue("");
    this.addressForm.get("city").setValue("");
    this.addressForm.get("state").setValue("");
  }

  enableComplementInput() {
    this.addressForm.get("complement").enable();
  }

  enableNumberInput() {
    this.addressForm.get("numberFinal").enable();
  }

  transferPartialAddressDataToForm() {
    this.resetForm();
    this.addressForm.get("street").setValue(this.componentsAddress[0].long_name);
    this.addressForm.get("district").setValue(this.componentsAddress[1].long_name);
    this.addressForm.get("city").setValue(this.componentsAddress[2].long_name);
    this.addressForm.get("state").setValue(this.componentsAddress[3].short_name);
  }
}
