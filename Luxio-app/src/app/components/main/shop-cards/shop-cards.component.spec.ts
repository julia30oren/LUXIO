import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopCardsComponent } from './shop-cards.component';

describe('ShopCardsComponent', () => {
  let component: ShopCardsComponent;
  let fixture: ComponentFixture<ShopCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
