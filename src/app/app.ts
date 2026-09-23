import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServerStatus } from './services/server-status/server-status';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('attendance-frontend');
  serverWakingUp = false;

  constructor(private serverStatus: ServerStatus) {
    this.serverStatus.wakingUp$.subscribe((wakingUp) => {
      this.serverWakingUp = wakingUp;
    });
  }
}
