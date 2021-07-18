import { TestBed } from '@angular/core/testing';
import { GiltinerTimerAppComponent } from './giltiner-timer-app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        GiltinerTimerAppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(GiltinerTimerAppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'giltine-raid-timer'`, () => {
    const fixture = TestBed.createComponent(GiltinerTimerAppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('giltine-raid-timer');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(GiltinerTimerAppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('giltine-raid-timer app is running!');
  });
});
