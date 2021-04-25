import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Task, TaskService } from './task.service';
import { TextService } from './text.service';

@Component({
  selector: 'simple-notes-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(
    private taskService: TaskService,
    private textService: TextService
  ) {}

  value$ = this.textService.value$;

  tasks$ = this.taskService.tasks$;

  onTextChanged(e: Event) {
    this.textService.setValue((e.target as HTMLTextAreaElement).value);
  }

  taskToggled(e: Task[]) {
    this.taskService.updateTasks(e);
  }
}
