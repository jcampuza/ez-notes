import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { TextService } from './text.service';
import { throttleTimeTrailing } from './util';

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
    throttleTimeTrailing(500),
    map((text) => this.tasksFromText(text))
  );

  showAllFilter$ = new BehaviorSubject<boolean>(false);
  toggleShowAll() {
    const v = this.showAllFilter$.getValue();
    this.showAllFilter$.next(!v);
  }

  visibleTasks$ = combineLatest([this.tasks$, this.showAllFilter$]).pipe(
    map(([tasks, showAll]) => {
      if (!tasks) {
        return [];
      }

      if (showAll) {
        return [...tasks].reverse();
      }

      return [...tasks].filter((t) => !t.completed).reverse();
    })
  );

  private onTasksUpdated$ = new Subject<Task[]>();

  private taskUpdateWatcher$ = this.onTasksUpdated$
    .pipe(withLatestFrom(this.textService.value$))
    .subscribe(([tasks, text]) => {
      this.updateTextFromTask(text, tasks);
    });

  updateTasks(tasks: Task[]) {
    this.onTasksUpdated$.next(tasks);
  }

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
