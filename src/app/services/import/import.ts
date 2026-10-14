import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  private apiUrl = 'https://boldt-backend.onrender.com/api';

  constructor(private http: HttpClient) {}

  importAccounts(file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post(
    `${this.apiUrl}/accounts/import`,
    formData,
    { responseType: 'text' }
  );
}
}