import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppIdComponent } from './app-id.component';

describe('AppIdComponent', () => {
  let component: AppIdComponent;
  let fixture: ComponentFixture<AppIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppIdComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
