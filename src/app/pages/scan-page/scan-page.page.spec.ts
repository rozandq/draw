import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanPagePage } from './scan-page.page';

describe('ScanPagePage', () => {
  let component: ScanPagePage;
  let fixture: ComponentFixture<ScanPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
