import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartSurveyPage } from './start-survey.page';

describe('StartSurveyPage', () => {
  let component: StartSurveyPage;
  let fixture: ComponentFixture<StartSurveyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartSurveyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartSurveyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
