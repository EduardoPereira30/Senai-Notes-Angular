import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedScreen } from './feed-screen';

describe('FeedScreen', () => {
  let component: FeedScreen;
  let fixture: ComponentFixture<FeedScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedScreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedScreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
