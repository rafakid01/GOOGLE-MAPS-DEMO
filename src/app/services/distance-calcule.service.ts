import { Injectable } from '@angular/core';
import { } from 'googlemaps';
import { LatLng, LatLngLiteral } from 'ngx-google-places-autocomplete/objects/latLng';

@Injectable({
  providedIn: 'root'
})
export class DistanceCalculeService {

  originObjectTest: LatLng = {
    equals(): boolean {
      return false;
    },
    lat() {
      return -23.3535957;
    },
    lng() {
      return -47.8597903;
    },
    toUrlValue(precision?: number): string {
      return "-23.3535957/-47.8597903";
    },
    toJSON(): LatLngLiteral {
      return {
        lat: -23.3535957,
        lng: -47.8597903
      };
    }
  }

  destinationObjectTest: LatLng = {
    equals(): boolean {
      return false;
    },
    lat() {
      return -23.348042;
    },
    lng() {
      return -47.840923;
    },
    toUrlValue(precision?: number): string {
      return "-23.348042/-47.840923";
    },
    toJSON(): LatLngLiteral {
      return {
        lat: -23.348042,
        lng: -47.840923
      };
    }
  }

  calculateDistance() {
    this.getDistance(this.originObjectTest, this.destinationObjectTest);
  }

  constructor() { }

  public getDistance(origin: LatLng, destination: LatLng) {
    const matrix = new google.maps.DistanceMatrixService();
    return new Promise((resolve, reject) => {
      matrix.getDistanceMatrix({
        origins: [new google.maps.LatLng(origin.lat(), origin.lng())],
        destinations: [new google.maps.LatLng(destination.lat(), destination.lng())],
        travelMode: google.maps.TravelMode.DRIVING,
      }, function (response, status) {
        if (status === 'OK') {
          console.log(response)
          resolve(response);
        } else {
          reject(response);
        }
      });
    })
  }
}