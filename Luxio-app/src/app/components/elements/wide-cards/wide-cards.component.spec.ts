import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WideCardsComponent } from './wide-cards.component';

describe('WideCardsComponent', () => {
  let component: WideCardsComponent;
  let fixture: ComponentFixture<WideCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WideCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WideCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
