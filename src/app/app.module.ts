import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { GiltinerTimerAppComponent } from './giltiner-timer-app.component';

@NgModule({
  declarations: [
    GiltinerTimerAppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [GiltinerTimerAppComponent]
})
export class AppModule { }
