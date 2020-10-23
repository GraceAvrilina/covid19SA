import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlosariumComponent } from './glosarium.component';

describe('GlosariumComponent', () => {
  let component: GlosariumComponent;
  let fixture: ComponentFixture<GlosariumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlosariumComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlosariumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
