import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CountdownTimer, CountdownTimerTick } from "./countdown-timer";
import { timer } from "rxjs";

const DURATION_GILTINE = 50000;
const DURATION_ABATARAS_45 = 45000;
const DURATION_ABATARAS_55 = 55000;
const MODE_GILTINE = 'giltine';
const MODE_ABATARAS = 'abataras';

const DURATION_LOOKUP: Record<string, number> = {
  giltine: DURATION_GILTINE,
  abataras45: DURATION_ABATARAS_45,
  abataras55: DURATION_ABATARAS_55
}

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

  private muted: boolean = true;
  private warningAudio = new Audio("assets/countdown.mp3");

  private customTimers: (number | undefined)[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.currentTimer = new CountdownTimer(DURATION_GILTINE, false);
    this.initializeTimer();
  }

  private initializeTimer(): void {
    this.currentTimer?.getTimer$().subscribe(timerTick => {
      this.timerTick = timerTick;

      if (!this.muted && timerTick.time <= 5000 && timerTick.time > 4500 && this.warningAudio.paused) {
        this.warningAudio.play();
      }

      if (timerTick.time <= 0) {
        this.currentTimer?.pause();
        const CONDENSE_DURATION = 400;
        timer(CONDENSE_DURATION).subscribe(() => {
          this.reset();
        });
      }

      this.changeDetectorRef.markForCheck();
    });
  }

  private setTimer(timer: CountdownTimer): void {
    this.warningAudio.load();
    this.currentTimer?.destroy();
    this.currentTimer = timer;
    this.initializeTimer();
    this.changeDetectorRef.markForCheck();
  }

  addTimer(seconds: string) {
    if (!seconds) {
      return;
    }
    this.customTimers.push(parseInt(seconds));
  }

  getCustomeTimers(): (number | undefined)[] {
    return this.customTimers;
  }

  startTimer(seconds: number): void {
    this.setTimer(new CountdownTimer(seconds * 1000, true));
  }

  setMode(mode: string): void {
    if (mode == this.currentMode) {
      return;
    }
    this.currentMode = mode;
    this.reset();
  }

  getMode(): string {
    return this.currentMode;
  }

  getTimerTick(): CountdownTimerTick | undefined {
    return this.timerTick;
  }

  getProgressWidth(): string {
    const percent = this.timerTick?.percent ?? 0;
    return (percent * 100).toString() + "%";
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
    this.setTimer(new CountdownTimer(DURATION_LOOKUP[this.currentMode], true));
  }

  toggleMute(): void {
    this.muted = !this.muted;
  }

  isMuted(): boolean {
    return this.muted;
  }

  ngOnDestroy() {
    this.currentTimer?.destroy();
  }
}
