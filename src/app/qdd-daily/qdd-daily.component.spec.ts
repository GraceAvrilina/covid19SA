import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QDDDailyComponent } from './qdd-daily.component';

describe('QDDDailyComponent', () => {
  let component: QDDDailyComponent;
  let fixture: ComponentFixture<QDDDailyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QDDDailyComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QDDDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
