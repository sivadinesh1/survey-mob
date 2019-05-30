import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMemberPage } from './list-member.page';

describe('ListMemberPage', () => {
  let component: ListMemberPage;
  let fixture: ComponentFixture<ListMemberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMemberPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMemberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
