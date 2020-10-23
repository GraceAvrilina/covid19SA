import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPerjalananDinasPageComponent } from './detail-perjalanan-dinas-page.component';

describe('DetailPerjalananDinasPageComponent', () => {
  let component: DetailPerjalananDinasPageComponent;
  let fixture: ComponentFixture<DetailPerjalananDinasPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailPerjalananDinasPageComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPerjalananDinasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
