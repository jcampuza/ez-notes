import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from '@simple-notes/ng-common';
import { fromEvent } from 'rxjs';

const PERSISTANCE_KEY = '@@TEXT@@';

@Injectable({
  providedIn: 'root',
})
export class PersistanceService {
  constructor(@Inject(LOCAL_STORAGE) private storage: Storage) {}

  storeText(value: string) {
    this.storage.setItem(PERSISTANCE_KEY, value);
  }

  getText() {
    return this.storage.getItem(PERSISTANCE_KEY) ?? '';
  }

  update$ = fromEvent(window, 'storage');
}
