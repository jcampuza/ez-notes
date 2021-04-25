import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'simple-notes-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpComponent {
  isOpen = false;
  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
