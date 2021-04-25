import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Task, TaskService } from './task.service';

@Component({
  selector: 'simple-notes-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private taskService: TaskService) {}

  taskToggled(e: Task[]) {
    this.taskService.updateTasks(e);
  }
}
