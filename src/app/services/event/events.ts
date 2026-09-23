import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventOverview {
  id: number;
  startDateTime: string;
  endDateTime: string;
  location: string;
  description: string;
  myAttendance: string | null;
  attendingCount: number;
  recurrenceGroupId: string | null;
}

export interface EventAttendanceUser {
  accountId: number;
  firstName: string;
  nickName: string;
  lastName: string;
  attendance: string | null;
}

export interface EventDetail {
  eventId: number;
  startDateTime: string;
  endDateTime: string;
  location: string;
  description: string;
  users: EventAttendanceUser[];
}

export interface EventCreateRequest {
  startDateTime: string;
  endDateTime: string;
  location: string;
  description: string;
  recurrence: string | null;
  repeatUntil: string | null;
}

export interface EventUpdateRequest {
  startDateTime: string;
  endDateTime: string;
  location: string;
  description: string;
  updateScope: 'THIS_EVENT' | 'THIS_AND_FUTURE' | 'ENTIRE_RECURRENCE';
}

@Injectable({
  providedIn: 'root'
})
export class Events {

  private apiUrl = 'https://boldt-backend.onrender.com/api/events';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<EventOverview[]> {
    return this.http.get<EventOverview[]>(this.apiUrl);
  }

  setAttendance(eventId: number, status: string): Observable<string> {
    return this.http.put(
        `${this.apiUrl}/${eventId}/attendance`,
        { status },
        { responseType: 'text' }
    );
   }

   getEventDetail(eventId: number): Observable<EventDetail> {
    return this.http.get<EventDetail>(
        `${this.apiUrl}/${eventId}/attendance`
    );
  }

  createEvent(request: EventCreateRequest): Observable<any> {
  return this.http.post(
    this.apiUrl,
    request,
    { responseType: 'text' }
  );
}

updateEvent(
  eventId: number,
  request: EventUpdateRequest
): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/${eventId}`,
    request,
    { responseType: 'text' }
  );
}

archiveEvent(
  eventId: number,
  archiveScope: 'THIS_EVENT' | 'THIS_AND_FUTURE' | 'ENTIRE_RECURRENCE'
): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/${eventId}/archive`,
    { archiveScope },
    { responseType: 'text' }
  );
}

getPastEvents(): Observable<EventOverview[]> {
  return this.http.get<EventOverview[]>(
    `${this.apiUrl}/past`
  );
}
}