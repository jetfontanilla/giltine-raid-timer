import { concat, interval, mergeMap, NEVER, Observable, of, Subject } from "rxjs";
import { finalize, map, startWith, switchMap, takeUntil, takeWhile, tap } from "rxjs/operators";
import { format } from "date-fns";

export interface CountdownTimerTick {
  time: number;
  timeString: string;
  isExpired: boolean;
  percent: number;
}

export class CountdownTimer {
  private remainingTime: string = "";
  private remainingTimeMs: number = 0;

  private onDestroy$ = new Subject<void>();
  private timer$: Observable<CountdownTimerTick>;
  private active$ = new Subject<boolean>();

  private paused: boolean = false;

  constructor(private durationMs: number = 0,
              private autoStart: boolean = false,
              private intervalMs: number = 100,
              private format: string = "ss.SSS") {
    this.remainingTimeMs = this.durationMs;
    this.remainingTime = this.computeRemainingTimeString(this.remainingTimeMs);
    this.timer$ = concat(of({
      time: this.remainingTimeMs,
      timeString: this.remainingTime,
      isExpired: this.remainingTimeMs <= 0 || this.isExpired(),
      percent: this.durationMs > 0 ? this.remainingTimeMs / this.durationMs : 0
    }), this.generateTimer$());
  }

  private generateTimer$(): Observable<CountdownTimerTick> {
    let baseTimer$ = this.generateIntervalTimer$(this.intervalMs);
    return this.active$.pipe(
      startWith(this.autoStart),
      tap(x => console.log(x)),
      tap(isActive => this.paused = !isActive),
      switchMap(isActive => isActive ? baseTimer$ : NEVER),
      tap(x => console.log(x)),
      takeUntil(this.onDestroy$),
      takeWhile(timerTick => timerTick?.time >= 0),
      finalize(() => this.complete())
    );
  }

  private generateIntervalTimer$(intervalMs: number): Observable<CountdownTimerTick> {
    return interval(intervalMs)
      .pipe(
        takeUntil(this.onDestroy$),
        map(() => {
          this.remainingTimeMs -= this.intervalMs;
          this.remainingTime = this.computeRemainingTimeString(this.remainingTimeMs);

          if (this.isComplete()) {
            this.complete();
          }

          return {
            time: this.remainingTimeMs,
            timeString: this.remainingTime,
            isExpired: this.remainingTimeMs <= 0 || this.isExpired(),
            percent: this.durationMs > 0 ? this.remainingTimeMs / this.durationMs : 0
          };
        })
      );
  }

  private isComplete(): boolean {
    return this.remainingTimeMs < this.intervalMs;
  }

  complete(): void {
    this.remainingTime = this.computeRemainingTimeString(0);
  }

  private computeRemainingTimeString(remainingTimeMs: number): string {
    if (remainingTimeMs <= 0) {
      return "";
    }
    return format(remainingTimeMs, this.format);
  }

  pause(): void {
    if (this.isExpired()) {
      return;
    }
    this.active$.next(false);
  }

  isPaused(): boolean {
    return this.paused;
  }

  resume(): void {
    if (this.isExpired()) {
      return;
    }
    this.active$.next(true);
  }

  getRemainingTime(): string {
    return this.remainingTime;
  }

  getRemainingTimeMs(): number {
    return this.remainingTimeMs;
  }

  isExpired(): boolean {
    return this.remainingTimeMs <= 0;
  }

  getTimer$(): Observable<CountdownTimerTick> {
    return this.timer$;
  }

  destroy(): void {
    this.onDestroy$.next();
  }

}
