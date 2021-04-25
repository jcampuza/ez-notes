import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HelpComponent } from './help/help.component';
import { TaskListComponent } from './task-list/task-list.component';
import { WriterComponent } from './writer/writer.component';

@NgModule({
  declarations: [AppComponent, HelpComponent, TaskListComponent, WriterComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent],
  providers: [],
})
export class AppModule {}
