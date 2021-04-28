import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Page, PageService } from '../page.service';

@Component({
  selector: 'simple-notes-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageListComponent {
  constructor(private pageService: PageService) {}

  pageList$ = this.pageService.pageList$;

  createPage() {
    this.pageService.createPage();
  }

  selectPage(page: Page) {
    this.pageService.setPageId(page.id);
  }

  getPageName(page: Page) {
    return page.value.substring(0, 50);
  }
}
