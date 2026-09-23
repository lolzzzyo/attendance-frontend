import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AccountService,
  AccountData
} from '../account';

@Component({
  selector: 'app-account',
  imports: [FormsModule],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account implements OnInit {

  account: AccountData | null = null;

  firstName = '';
  nickname = '';
  lastName = '';
  password = '';

  loading = true;
  saving = false;

  successMessage = '';
  errorMessage = '';

  constructor(
    private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAccount();
  }

  loadAccount(): void {
    this.accountService.getAccount().subscribe({
      next: (account) => {
        this.account = account;

        this.firstName = account.firstName;
        this.nickname = account.nickname ?? '';
        this.lastName = account.lastName;

        this.loading = false;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load account:', error);

        this.loading = false;
        this.errorMessage = 'Failed to load account.';

        this.cdr.detectChanges();
      }
    });
  }

  save(): void {
    if (this.saving) {
      return;
    }

    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';

    const request = {
      firstName: this.firstName,
      nickname: this.nickname,
      lastName: this.lastName,
      password: this.password
    };

    this.accountService.updateAccount(request).subscribe({
      next: () => {
        this.saving = false;
        this.password = '';
        this.successMessage = 'Account updated successfully.';

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to update account:', error);

        this.saving = false;
        this.errorMessage = 'Failed to update account.';

        this.cdr.detectChanges();
      }
    });
  }
}