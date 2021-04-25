import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PersistanceService } from './persistance.service';
import { Destroyer, throttleTimeTrailing } from './util';

@Injectable({
  providedIn: 'root',
})
export class TextService implements OnDestroy {
  constructor(private persistanceService: PersistanceService) {}

  private destroyer$ = new Destroyer();

  private _value$ = new BehaviorSubject(this.persistanceService.getText());

  private onStorageUpdated$ = this.persistanceService.update$
    .pipe(takeUntil(this.destroyer$))
    .subscribe(() => {
      this._value$.next(this.persistanceService.getText());
    });

  private storageUpdater$ = this._value$
    .pipe(throttleTimeTrailing(400), takeUntil(this.destroyer$))
    .subscribe((value) => {
      this.persistanceService.storeText(value);
    });

  value$ = this._value$.asObservable();
  setValue(value: string) {
    this._value$.next(value);
  }

  ngOnDestroy() {
    this.destroyer$.destroy();
  }
}
