import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MvpCardComponent } from './mvp-card.component';

describe('MvpCardComponent', () => {
  let component: MvpCardComponent;
  let fixture: ComponentFixture<MvpCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MvpCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MvpCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
