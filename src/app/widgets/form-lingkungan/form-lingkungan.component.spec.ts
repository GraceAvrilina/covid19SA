import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLingkunganComponent } from './form-lingkungan.component';

describe('FormLingkunganComponent', () => {
  let component: FormLingkunganComponent;
  let fixture: ComponentFixture<FormLingkunganComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormLingkunganComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLingkunganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
