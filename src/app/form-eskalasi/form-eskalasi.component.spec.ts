import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEskalasiComponent } from './form-eskalasi.component';

describe('FormEskalasiComponent', () => {
  let component: FormEskalasiComponent;
  let fixture: ComponentFixture<FormEskalasiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormEskalasiComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEskalasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
