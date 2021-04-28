import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  TrackByFunction,
} from '@angular/core';
import { Task, TaskService } from '../task.service';

@Component({
  selector: 'simple-notes-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {
  @Output() tasksUpdate = new EventEmitter<Task[]>();

  constructor(private taskService: TaskService) {}

  visibleTasks$ = this.taskService.visibleTasks$;

  allTasks$ = this.taskService.tasks$;

  showAll$ = this.taskService.showAllFilter$;

  toggleShowALl() {
    this.taskService.toggleShowAll();
  }

  trackTaskById: TrackByFunction<Task> = (_: number, task: Task) => {
    return task.id;
  };

  onToggle(task: Task) {
    this.taskService.toggleTask(task);
  }
}
