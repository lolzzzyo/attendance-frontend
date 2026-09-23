import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import {
  Events,
  EventOverview,
  EventAttendanceUser,
  EventDetail
} from '../../services/event/events';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-past',
  imports: [DatePipe],
  templateUrl: './past.html',
  styleUrl: './past.css'
})
export class Past implements OnInit {

  events: EventOverview[] = [];
  loading = true;
  errorMessage = '';
  loadingEventDetail = false;
  selectedEvent: EventDetail | null = null;

  constructor(
    private eventsService: Events,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPastEvents();
  }

  loadPastEvents(): void {
    this.loading = true;
    this.errorMessage = '';

    this.eventsService.getPastEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load past events:', error);
        this.loading = false;
        this.errorMessage = 'Failed to load past events.';
        this.cdr.detectChanges();
      }
    });
  }

 openEvent(event: EventOverview): void {
  this.loadingEventDetail = true;
  this.selectedEvent = null;

  this.eventsService.getEventDetail(event.id).subscribe({
    next: (eventDetail) => {
      this.selectedEvent = eventDetail;
      this.loadingEventDetail = false;

      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Failed to load event details:', error);

      this.loadingEventDetail = false;

      this.cdr.detectChanges();
    }
  });
}

closeEvent(): void {
  this.selectedEvent = null;
}

getUsersByAttendance(status: string): EventAttendanceUser[] {
    if (!this.selectedEvent) {
      return [];
    }

    return this.selectedEvent.users.filter(
      user => user.attendance === status
    );
  }

  getUsersWithoutAttendance(): EventAttendanceUser[] {
    if (!this.selectedEvent) {
      return [];
    }

    return this.selectedEvent.users.filter(
      user => user.attendance === null
    );
  }
}