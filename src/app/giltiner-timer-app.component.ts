import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CountdownTimer, CountdownTimerTick } from "./countdown-timer";

const DURATION_GILTINE = 50000;
const DURATION_ABATARAS = 45000;
const MODE_GILTINE = 'giltine';
const MODE_ABATARAS = 'abataras';

@Component({
  selector: 'giltine-timer-app',
  templateUrl: './giltine-timer-app.component.html',
  styleUrls: ['./giltine-timer-app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiltinerTimerAppComponent implements OnInit, OnDestroy {
  private currentTimer?: CountdownTimer;
  private currentMode = MODE_GILTINE;
  private timerTick?: CountdownTimerTick;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.currentTimer = new CountdownTimer(DURATION_GILTINE, false);
    this.initializeTimer();
  }

  private initializeTimer(): void {
    this.currentTimer?.getTimer$().subscribe(timerTick => {
      this.timerTick = timerTick;
      this.changeDetectorRef.markForCheck();
    });
  }

  getMode(): string {
    return this.currentMode;
  }

  getTimerTick(): CountdownTimerTick | undefined {
    return this.timerTick;
  }

  pause(): void {
    this.currentTimer?.pause();
    this.changeDetectorRef.markForCheck();
  }

  isPaused(): boolean {
    return this.currentTimer?.isPaused() ?? false;
  }

  resume(): void {
    this.currentTimer?.resume();
    this.changeDetectorRef.markForCheck();
  }

  reset(): void {
    this.currentTimer?.destroy();
    this.currentTimer = new CountdownTimer(DURATION_GILTINE, false);
    this.initializeTimer();
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy() {
    this.currentTimer?.destroy();
  }
}
