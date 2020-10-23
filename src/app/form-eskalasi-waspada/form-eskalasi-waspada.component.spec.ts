import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEskalasiWaspadaComponent } from './form-eskalasi-waspada.component';

describe('FormEskalasiWaspadaComponent', () => {
  let component: FormEskalasiWaspadaComponent;
  let fixture: ComponentFixture<FormEskalasiWaspadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormEskalasiWaspadaComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEskalasiWaspadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
