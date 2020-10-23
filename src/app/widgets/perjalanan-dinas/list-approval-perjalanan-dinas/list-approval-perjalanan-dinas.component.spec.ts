import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListApprovalPerjalananDinasComponent } from './list-approval-perjalanan-dinas.component';

describe('ListApprovalPerjalananDinasComponent', () => {
  let component: ListApprovalPerjalananDinasComponent;
  let fixture: ComponentFixture<ListApprovalPerjalananDinasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListApprovalPerjalananDinasComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListApprovalPerjalananDinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
