import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAssassmentp2Component } from './form-assassmentp2.component';

describe('FormAssassmentp2Component', () => {
  let component: FormAssassmentp2Component;
  let fixture: ComponentFixture<FormAssassmentp2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAssassmentp2Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAssassmentp2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
