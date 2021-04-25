import { asyncScheduler, Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

export class Destroyer extends Subject<void> {
  destroy() {
    this.next();
    this.complete();
  }
}

export const throttleTimeTrailing = <T>(time: number) =>
  throttleTime<T>(time, asyncScheduler, { trailing: true });
