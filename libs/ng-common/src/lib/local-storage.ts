import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window';

export const LOCAL_STORAGE = new InjectionToken<Storage>('@@local-storage@@', {
  factory: () => {
    return inject(WINDOW).localStorage;
  },
});
