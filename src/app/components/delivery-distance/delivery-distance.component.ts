import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-delivery-distance',
  templateUrl: './delivery-distance.component.html',
  styleUrls: ['./delivery-distance.component.css']
})
export class DeliveryDistanceComponent {
  @Input()
  public distanceObj: any;

  @Input()
  public trajectoryObj: any;
}
