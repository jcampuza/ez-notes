import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
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
  @Input() tasks!: Task[];

  @Output() tasksUpdate = new EventEmitter<Task[]>();

  constructor(private taskService: TaskService) {}

  showAll = false;

  setShowAll() {
    this.showAll = !this.showAll;
  }

  trackTaskById: TrackByFunction<Task> = (_: number, task: Task) => {
    return task.id;
  };

  getVisibleTasks() {
    if (this.showAll) {
      return this.tasks;
    }

    if (!this.tasks) {
      return [];
    }

    return this.tasks
      .filter((t) => !t.completed)
      .slice()
      .reverse();
  }

  onToggle(task: Task) {
    const updatedTasks = this.tasks.map((item) => {
      if (item.id === task.id) {
        return this.taskService.cloneTask(item, { completed: !item.completed });
      }

      return item;
    });

    this.tasksUpdate.emit(updatedTasks);
  }
}
