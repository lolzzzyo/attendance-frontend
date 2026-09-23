import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AccountData {
  firstName: string;
  nickname: string | null;
  lastName: string;
  email: string;
}

export interface AccountUpdateRequest {
  firstName: string;
  nickname: string;
  lastName: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = 'https://boldt-backend.onrender.com/api/account/me';

  constructor(private http: HttpClient) {}

  getAccount(): Observable<AccountData> {
    return this.http.get<AccountData>(this.apiUrl);
  }

  updateAccount(request: AccountUpdateRequest): Observable<string> {
    return this.http.put(
      this.apiUrl,
      request,
      { responseType: 'text' }
    );
  }
}