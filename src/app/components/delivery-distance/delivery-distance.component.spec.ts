import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryDistanceComponent } from './delivery-distance.component';

describe('DeliveryDistanceComponent', () => {
  let component: DeliveryDistanceComponent;
  let fixture: ComponentFixture<DeliveryDistanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryDistanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
