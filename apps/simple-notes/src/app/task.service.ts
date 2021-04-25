import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  debounceTime,
  map,
  tap,
  throttleTime,
  withLatestFrom,
} from 'rxjs/operators';
import { TextService } from './text.service';

export interface Task {
  task: string;
  id: number;
  completed: boolean;
}

export const TASK_COMMAND = '!task ';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private textService: TextService) {}

  tasks$ = this.textService.value$.pipe(
    throttleTime(400),
    map((text) => this.tasksFromText(text))
  );

  private onTasksUpdated$ = new Subject<Task[]>();

  updateTasks(tasks: Task[]) {
    this.onTasksUpdated$.next(tasks);
  }

  private taskUpdateWatcher$ = this.onTasksUpdated$
    .pipe(
      withLatestFrom(this.textService.value$),
      tap(([tasks, text]) => {
        this.updateTextFromTask(text, tasks);
      })
    )
    .subscribe();

  createTask(task: Task) {
    return task;
  }

  cloneTask(task: Task, taskUpdates: Partial<Task>) {
    return {
      ...task,
      ...taskUpdates,
    };
  }

  toTaskString(task: Task) {
    return `${TASK_COMMAND}${task.task}${task.completed ? ' /done' : ''}`;
  }

  taskFromTextLine(line: string, id: number) {
    return this.createTask({
      task: line.split(TASK_COMMAND)[1].replace(' /done', ''),
      id: id,
      completed: line.endsWith(' /done'),
    });
  }

  tasksFromText(text: string) {
    const lines = text.split('\n');

    const tasks = lines
      .filter((line) => line.startsWith(TASK_COMMAND))
      .map((line, index) => {
        return this.taskFromTextLine(line, index);
      });

    return tasks;
  }

  private updateTextFromTask = (value: string, tasks: Task[]) => {
    const lines = value.split('\n');
    let id = 0;

    const update = lines
      .map((line) => {
        if (!line.startsWith(TASK_COMMAND)) {
          return line;
        }

        const nextTask = tasks[id++];
        return this.toTaskString(nextTask);
      })
      .join('\n');

    this.textService.setValue(update);
  };
}
