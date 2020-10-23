import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDraftPerjalananDinasComponent } from './list-draft-perjalanan-dinas.component';

describe('ListDraftPerjalananDinasComponent', () => {
  let component: ListDraftPerjalananDinasComponent;
  let fixture: ComponentFixture<ListDraftPerjalananDinasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDraftPerjalananDinasComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDraftPerjalananDinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
