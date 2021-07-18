import { interval, Observable, Subject } from "rxjs";
import { finalize, map, startWith, switchMap, takeUntil, takeWhile } from "rxjs/operators";
import { format } from "date-fns";
import { NEVER } from "rxjs/src/internal/observable/never";

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

  constructor(private durationMs: number = 0,
              private autoStart: boolean = false,
              private intervalMs: number = 100,
              private format: string = "mm:ss.SSS") {
    let baseTimer$ = this.generateTimer$(this.intervalMs);
    this.timer$ = this.active$.pipe(
      startWith(autoStart),
      switchMap(isActive => isActive ? baseTimer$ : NEVER),
      takeUntil(this.onDestroy$),
      takeWhile(timerTick => timerTick.time >= 0),
      finalize(() => this.complete())
    );
  }

  private generateTimer$(intervalMs: number): Observable<CountdownTimerTick> {
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
            timeString: this.getRemainingTime(),
            isExpired: this.remainingTimeMs <= 0 || this.isExpired(),
            percent: this.durationMs > 0 ? this.remainingTimeMs / this.durationMs : 0
          };
        })
      );
  }

  private isComplete(): boolean {
    return this.remainingTimeMs < this.intervalMs;
  }

  reset(): void {
    this.remainingTimeMs = this.durationMs;
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
