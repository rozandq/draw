import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessPage } from './guess.page';

describe('GuessPage', () => {
  let component: GuessPage;
  let fixture: ComponentFixture<GuessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuessPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
