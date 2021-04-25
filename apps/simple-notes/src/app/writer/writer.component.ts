import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { TextService } from '../text.service';

@Component({
  selector: 'simple-notes-writer',
  templateUrl: './writer.component.html',
  styleUrls: ['./writer.component.scss'],
})
export class WriterComponent implements AfterViewInit {
  constructor(private textService: TextService) {}

  @ViewChild('writer') writer: ElementRef<HTMLTextAreaElement>;

  value$ = this.textService.value$;

  onTextChanged(e: Event) {
    this.textService.setValue((e.target as HTMLTextAreaElement).value);
  }

  ngAfterViewInit() {
    const scrollHeight = this.writer.nativeElement.scrollHeight;

    this.writer.nativeElement.scrollTo({
      top: scrollHeight,
    });
  }
}
