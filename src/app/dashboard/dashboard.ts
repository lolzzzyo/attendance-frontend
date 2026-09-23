import { FormsModule } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  Events,
  EventOverview,
  EventDetail,
  EventAttendanceUser
} from '../events';
import { Auth } from '../auth'

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  events: EventOverview[] = [];
  loading = true;
  errorMessage = '';

  selectedEvent: EventDetail | null = null;
  loadingEventDetail = false;

  isAdmin = false;

  showCreateEventModal = false;
  creatingEvent = false;

  newEvent = {
    startDateTime: '',
    endDateTime: '',
    location: '',
    description: '',
    recurrence: 'NONE',
    repeatUntil: ''
  };

  showEventMenuId: number | null = null;

  showEditEventModal = false;
  editingEvent: EventOverview | null = null;
  updatingEvent = false;

  showArchiveModal = false;
  archivingEvent: EventOverview | null = null;
  archivingEventScope:
    | 'THIS_EVENT'
    | 'THIS_AND_FUTURE'
    | 'ENTIRE_RECURRENCE' = 'THIS_EVENT';

  archivingEventInProgress = false;

    editingEventUpdateScope:
  | 'THIS_EVENT'
  | 'THIS_AND_FUTURE'
  | 'ENTIRE_RECURRENCE' = 'THIS_EVENT';

  constructor(
    private eventsService: Events,
    private cdr: ChangeDetectorRef,
    private auth: Auth,
    private router: Router
  ) {
    this.isAdmin = this.auth.isAdmin();
  }

  ngOnInit(): void {
    this.loadEvents();
  }

loadEvents(): void {
  this.loading = true;

  this.eventsService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Failed to load events:', error);

        this.loading = false;
        this.errorMessage = 'Failed to load events.';

        this.cdr.detectChanges();
      }
    });
  }

  getMapUrl(location: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  }

  setAttendance(event: EventOverview, status: string): void {

    if (event.myAttendance === status) {
      return;
    }

    this.eventsService.setAttendance(event.id, status).subscribe({
      next: () => {

        const oldStatus = event.myAttendance;

        event.myAttendance = status;

        if (oldStatus !== 'ATTENDING' && status === 'ATTENDING') {
          event.attendingCount++;
        }

        if (oldStatus === 'ATTENDING' && status !== 'ATTENDING') {
          event.attendingCount--;
        }

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Failed to update attendance:', error);
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

  openCreateEventModal(): void {
  this.newEvent = {
    startDateTime: '',
    endDateTime: '',
    location: '',
    description: '',
    recurrence: 'NONE',
    repeatUntil: ''
  };

  this.showCreateEventModal = true;
}

closeCreateEventModal(): void {
  if (this.creatingEvent) {
    return;
  }

  this.showCreateEventModal = false;
}

createEvent(): void {
  if (this.creatingEvent) {
    return;
  }

  this.creatingEvent = true;

  const request = {
    startDateTime: this.newEvent.startDateTime,
    endDateTime: this.newEvent.endDateTime,
    location: this.newEvent.location,
    description: this.newEvent.description,
    recurrence:
      this.newEvent.recurrence === 'NONE'
        ? null
        : this.newEvent.recurrence,
    repeatUntil:
      this.newEvent.recurrence === 'NONE'
        ? null
        : this.newEvent.repeatUntil
  };

  this.eventsService.createEvent(request).subscribe({
    next: () => {
      this.showCreateEventModal = false;
      this.creatingEvent = false;

      this.loadEvents();
    },

    error: (error) => {
      console.error('Failed to create event:', error);

      this.creatingEvent = false;

      this.cdr.detectChanges();
    }
  });
}

toggleEventMenu(eventId: number, event: MouseEvent): void {
  event.stopPropagation();

  if (this.showEventMenuId === eventId) {
    this.showEventMenuId = null;
  } else {
    this.showEventMenuId = eventId;
  }
}

openEditEvent(event: EventOverview, mouseEvent: MouseEvent): void {
  mouseEvent.stopPropagation();

  this.showEventMenuId = null;

  this.editingEvent = {
    ...event
  };

  this.showEditEventModal = true;
}
closeEditEvent(): void {
  if (this.updatingEvent) {
    return;
  }

  this.showEditEventModal = false;
  this.editingEvent = null;
}

updateEvent(): void {
  if (!this.editingEvent || this.updatingEvent) {
    return;
  }

  this.updatingEvent = true;

  const request = {
    startDateTime: this.editingEvent.startDateTime,
    endDateTime: this.editingEvent.endDateTime,
    location: this.editingEvent.location,
    description: this.editingEvent.description,
    updateScope: this.editingEvent.recurrenceGroupId
      ? this.editingEventUpdateScope
      : 'THIS_EVENT'
  };

  this.eventsService.updateEvent(
    this.editingEvent.id,
    request
  ).subscribe({
    next: () => {
      this.showEditEventModal = false;
      this.editingEvent = null;
      this.updatingEvent = false;

      this.loadEvents();
    },
    error: (error) => {
      console.error('Failed to update event:', error);

      this.updatingEvent = false;
      this.cdr.detectChanges();
    }
  });
}

openArchiveEvent(
  event: EventOverview,
  mouseEvent: MouseEvent
): void {
  mouseEvent.stopPropagation();

  this.showEventMenuId = null;

  this.archivingEvent = {
    ...event
  };

  this.archivingEventScope = 'THIS_EVENT';
  this.showArchiveModal = true;

  this.cdr.detectChanges();
}

closeArchiveEvent(): void {
  if (this.archivingEventInProgress) {
    return;
  }

  this.showArchiveModal = false;
  this.archivingEvent = null;
}

archiveEvent(): void {
  if (!this.archivingEvent || this.archivingEventInProgress) {
    return;
  }

  this.archivingEventInProgress = true;

  this.eventsService.archiveEvent(
    this.archivingEvent.id,
    this.archivingEventScope
  ).subscribe({
    next: () => {
      this.showArchiveModal = false;
      this.archivingEvent = null;
      this.archivingEventInProgress = false;

      this.loadEvents();
    },
    error: (error) => {
      console.error('Failed to archive event:', error);

      this.archivingEventInProgress = false;
      this.cdr.detectChanges();
    }
  });
}
}