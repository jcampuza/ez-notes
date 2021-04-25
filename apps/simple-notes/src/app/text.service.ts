import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, takeUntil, throttleTime } from 'rxjs/operators';
import { PersistanceService } from './persistance.service';

class Destroyer extends Subject<void> {
  destroy() {
    this.next();
    this.complete();
  }
}

@Injectable({
  providedIn: 'root',
})
export class TextService implements OnDestroy {
  constructor(private persistanceService: PersistanceService) {}

  private _value$ = new BehaviorSubject(this.persistanceService.getText());

  value$ = this._value$.asObservable();

  setValue(value: string) {
    this._value$.next(value);
  }

  private destroyer$ = new Destroyer();

  private onStorageUpdated$ = this.persistanceService.update$
    .pipe(takeUntil(this.destroyer$))
    .subscribe(() => {
      this._value$.next(this.persistanceService.getText());
    });

  private storageUpdater$ = this._value$
    .pipe(throttleTime(400), takeUntil(this.destroyer$))
    .subscribe((value) => {
      this.persistanceService.storeText(value);
    });

  ngOnDestroy() {
    this.destroyer$.destroy();
  }
}
