import { Injectable } from '@angular/core';
import { } from 'googlemaps';
import { LatLng, LatLngLiteral } from 'ngx-google-places-autocomplete/objects/latLng';
import { Location } from '../classes/location';

@Injectable({
  providedIn: 'root'
})
export class DistanceCalculeService {

  calculateDistance(origin: Location, location: Location) {
    let originLatLng: LatLng = {
      lat() {
        return origin.lat;
      },
      lng() {
        return origin.lng;
      }
    }
    let locationLatLng: LatLng = {
      lat() {
        return location.lat;
      },
      lng() {
        return location.lng;
      }
    }
    return this.getDistance(originLatLng, locationLatLng);
    
  }

  constructor() { }

  getDistance(origin: LatLng, destination: LatLng) {
    const matrix = new google.maps.DistanceMatrixService();
    return new Promise((resolve, reject) => {
      matrix.getDistanceMatrix({
        origins: [new google.maps.LatLng(origin.lat(), origin.lng())],
        destinations: [new google.maps.LatLng(destination.lat(), destination.lng())],
        travelMode: google.maps.TravelMode.DRIVING,
      }, function (response, status) {
        if (status === 'OK') {
          resolve(response);
        } else {
          reject(response);
        }
      });
    })
  }
}