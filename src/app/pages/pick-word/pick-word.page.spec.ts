import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickWordPage } from './pick-word.page';

describe('PickWordPage', () => {
  let component: PickWordPage;
  let fixture: ComponentFixture<PickWordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickWordPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickWordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
