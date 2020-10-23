import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSentPerjalananDinasComponent } from './list-sent-perjalanan-dinas.component';

describe('ListSentPerjalananDinasComponent', () => {
  let component: ListSentPerjalananDinasComponent;
  let fixture: ComponentFixture<ListSentPerjalananDinasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSentPerjalananDinasComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSentPerjalananDinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
