import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSurveyPage } from './new-survey.page';

describe('NewSurveyPage', () => {
  let component: NewSurveyPage;
  let fixture: ComponentFixture<NewSurveyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSurveyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSurveyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
