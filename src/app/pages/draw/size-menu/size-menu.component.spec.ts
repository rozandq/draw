import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeMenuComponent } from './size-menu.component';

describe('SizeMenuComponent', () => {
  let component: SizeMenuComponent;
  let fixture: ComponentFixture<SizeMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SizeMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SizeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
