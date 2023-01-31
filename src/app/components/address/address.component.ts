import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { FormBuilder, Validators } from '@angular/forms'
import { OnInit } from '@angular/core';
import { DistanceCalculeService } from 'src/app/services/distance-calcule.service';
import { Location } from 'src/app/classes/location';
import { MaskPipe } from 'ngx-mask';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  @ViewChild("mapSearchField") searchField!: ElementRef;
  @ViewChild(GoogleMap) map!: GoogleMap;

  searchOptions: any = {
    componentRestrictions: { country: "BR" },
    fields: ["address_components", "geometry", "icon", "name"],
  }
  componentsAddress: any;
  userLatitude: any;
  userLongitude: any;

  addressForm: any;
  typeSelect: any;
  vehicleSelect: any;

  userLocation: Location;
  destination?: Location;

  center: google.maps.LatLngLiteral;
  zoom: number;
  mapOptions: google.maps.MapOptions;
  markerOptions: google.maps.MarkerOptions;
  location?: google.maps.LatLngLiteral;
  marker: any;

  public distanceTotal?: any;
  public trajectoryObject?: any;

  constructor(
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private distanceService: DistanceCalculeService
  ) {
    this.userLocation = {
      lat: -23.3595757,
      lng: -47.8709175,
    }

    this.center = {
      lat: -23.3595757,
      lng: -47.8709175
    };

    this.mapOptions = {
      mapTypeId: 'roadmap',
      disableDoubleClickZoom: true,
      draggableCursor: "default",
      draggingCursor: "move",
      streetViewControl: false,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      fullscreenControl: false
    }

    this.markerOptions = {
      cursor: "default",
    }

    this.zoom = 14;
  }

  ngAfterViewInit(): void {
    const searchBox = new google.maps.places.SearchBox(
      this.searchField.nativeElement
    );
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      this.searchField.nativeElement,
    );
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) {
        return;
      }
      const bounds = new google.maps.LatLngBounds();
      places.forEach(place => {
        if (!place.geometry || !place.geometry!.location) {
          return
        }
        if (place.geometry!.viewport) {
          bounds.union(place.geometry!.viewport);
        } else {
          bounds.extend(place.geometry!.location);
        }
      });
      this.map.fitBounds(bounds);
      this.marker = {
        position: this.map.centerChanged.destination._value.center
      };
      this.zoom = 20;
      this.location = this.marker.position;
    })
  }

  ngOnInit() {
    this.createInitForm();
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

  getLocation(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.marker = {
        position: event.latLng.toJSON()
      }
      this.location = event.latLng.toJSON();
      console.log(this.marker);
    }
  }

  cleanAddressInput() {
    let addressHTMLInput: any = document.getElementById("addressInput");
    addressHTMLInput.value = "";
    this.componentsAddress = null;
    this.renderer.selectRootElement("#addressInput").focus();
    this.cleanAddressesObject();
  }

  cleanAddressesObject() {
    this.distanceTotal = null;
    this.trajectoryObject = null;
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

  throwNewError() {
    let alertHTML = document.getElementById("rewriteAlert");
    alertHTML!.className = "p-1 alert alert-danger rewrite-alert show";
    this.componentsAddress = null;
    throw new Error("Endereço Inválido, insira novamente");
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

    this.transferBruteValues(addressToVerify)

    if (objectFirstIndexValue == "street_number") {
      this.callWithNumberFunctions();
    }
    // else if (objectFirstIndexValue == "route") {
    // this.callLeftNumberFunctions();
    // }
    else {
      this.throwNewError()
    }
  }

  transferBruteValues(address: Address) {
    this.componentsAddress = address.address_components;
    this.userLatitude = address.geometry.location.lat();
    this.userLongitude = address.geometry.location.lng();
  }

  callWithNumberFunctions() {
    this.hideElementAlert();
    this.transferFullAddressDataToForm();
    this.enableComplementInput();
    console.log(this.componentsAddress);
  }

  // callLeftNumberFunctions() {
  //   this.hideElementAlert();
  //   this.transferPartialAddressDataToForm();
  //   this.enableNumberInput();
  //   this.enableComplementInput();
  //   console.log(this.componentsAddress);
  // }

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

  // transferPartialAddressDataToForm() {
  //   this.resetForm();
  //   this.addressForm.get("street").setValue(this.componentsAddress[0].long_name);
  //   this.addressForm.get("district").setValue(this.componentsAddress[1].long_name);
  //   this.addressForm.get("city").setValue(this.componentsAddress[2].long_name);
  //   this.addressForm.get("state").setValue(this.componentsAddress[3].short_name);
  // }

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

  // enableNumberInput() {
  //   this.addressForm.get("numberFinal").enable();
  // }

  createDestinationObject() {
    this.destination = {
      lat: this.userLatitude,
      lng: this.userLongitude,
    }
    Promise.resolve(this.calculateDistance(this.userLocation, this.destination));
  }

  calculateDistance(origin: Location, location: Location) {

    const distanceObject = Promise.resolve(this.distanceService.calculateDistance(origin, location));

    distanceObject.then((distance: any) => {
      this.distanceTotal = distance.rows[0].elements[0].distance;
      this.trajectoryObject = {
        origin: distance?.originAddresses[0],
        destination: distance?.destinationAddresses[0]
      };
      console.log(this.distanceTotal);
      console.log(this.trajectoryObject);
    })
  }

}
