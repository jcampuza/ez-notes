import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersistanceService } from './persistance.service';
import { Dictionary, throttleTimeTrailing, uniqueId } from './util';

export interface Page {
  id: string;
  updated: number;
  value: string;
}

type PagesDict = Dictionary<string, Page>;

const PAGE_KEY = '@@PAGES@@';
const SELECTED_PAGE_KEY = '@@SELECTED_PAGE@@';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  constructor(private persistanceService: PersistanceService) {}
  pages$ = new BehaviorSubject<PagesDict>(
    this.persistanceService.getJson<PagesDict>(PAGE_KEY) ?? {}
  );

  pageList$ = this.pages$.pipe(
    map((pageDict) => Object.values(pageDict) as Page[])
  );

  selectedPageId$ = new BehaviorSubject<string>(
    this.persistanceService.get(SELECTED_PAGE_KEY) ?? ''
  );

  selectedPageById$ = combineLatest([this.pages$, this.selectedPageId$]).pipe(
    map(([pages, pageId]) => pages[pageId])
  );

  syncToStorage$ = combineLatest([this.pages$, this.selectedPageId$])
    .pipe(throttleTimeTrailing(400))
    .subscribe(([pages, key]) => {
      this.persistanceService.set(SELECTED_PAGE_KEY, key);
      this.persistanceService.setJson(PAGE_KEY, pages);
    });

  syncFromStorage$ = this.persistanceService.update$.subscribe(() => {
    const dict = this.persistanceService.getJson<PagesDict>(PAGE_KEY) ?? {};
    this.pages$.next(dict);
  });

  setSelectedPageValue(value: string) {
    const pageId = this.selectedPageId$.getValue();
    const pages = this.pages$.getValue();
    const page = pages[pageId];

    if (!page) {
      return;
    }

    this.pages$.next({
      ...pages,
      [pageId]: {
        ...page,
        value,
      },
    });
  }

  createPage() {
    const page: Page = {
      id: uniqueId(),
      updated: Date.now(),
      value: '',
    };

    this.pages$.next({
      ...this.pages$.getValue(),
      [page.id]: page,
    });

    this.selectedPageId$.next(page.id);
  }

  setPageId(id: string) {
    this.selectedPageId$.next(id);
  }
}
