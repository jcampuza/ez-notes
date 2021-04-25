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

  tasks$ = this.taskService.visibleTasks$;

  showAll$ = this.taskService.showAllFilter$;

  toggleShowALl() {
    this.taskService.toggleShowAll();
  }

  trackTaskById: TrackByFunction<Task> = (_: number, task: Task) => {
    return task.id;
  };

  onToggle(tasks: Task[], task: Task) {
    const updatedTasks = tasks.map((item) => {
      if (item.id === task.id) {
        return this.taskService.cloneTask(item, { completed: !item.completed });
      }

      return item;
    });

    this.taskService.updateTasks(updatedTasks);
  }
}
