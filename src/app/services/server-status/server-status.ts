import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerStatus {

  private wakingUpSubject = new BehaviorSubject<boolean>(false);

  wakingUp$ = this.wakingUpSubject.asObservable();

  showWakingUp(): void {
    this.wakingUpSubject.next(true);
  }

  hideWakingUp(): void {
    this.wakingUpSubject.next(false);
  }
}