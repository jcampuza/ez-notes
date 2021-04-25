import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export const WINDOW = new InjectionToken<Window>('@@window_token@@', {
  factory: () => {
    const { defaultView } = inject(DOCUMENT);

    if (!document.defaultView) {
      throw new Error('Window not available in this environment');
    }

    return defaultView;
  },
});
