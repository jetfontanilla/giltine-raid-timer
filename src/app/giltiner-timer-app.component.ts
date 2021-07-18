import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CountdownTimer } from "./countdown-timer";

const DURATION_GILTINE = 50000;
const DURATION_ABATARAS = 45000;

@Component({
  selector: 'giltine-timer-app',
  templateUrl: './giltine-timer-app.component.html',
  styleUrls: ['./giltine-timer-app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiltinerTimerAppComponent implements OnInit, OnDestroy {
  private currentTimer: CountdownTimer;

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
