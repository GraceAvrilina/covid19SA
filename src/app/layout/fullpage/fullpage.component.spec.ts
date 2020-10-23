import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullpageComponent } from './fullpage.component';

describe('FullpageComponent', () => {
  let component: FullpageComponent;
  let fixture: ComponentFixture<FullpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullpageComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
