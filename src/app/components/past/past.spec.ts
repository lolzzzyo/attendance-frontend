import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Past } from './past';

describe('Past', () => {
  let component: Past;
  let fixture: ComponentFixture<Past>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Past],
    }).compileComponents();

    fixture = TestBed.createComponent(Past);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
