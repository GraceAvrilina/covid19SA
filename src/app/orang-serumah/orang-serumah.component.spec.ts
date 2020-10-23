import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrangSerumahComponent } from './orang-serumah.component';

describe('OrangSerumahComponent', () => {
  let component: OrangSerumahComponent;
  let fixture: ComponentFixture<OrangSerumahComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrangSerumahComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrangSerumahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
