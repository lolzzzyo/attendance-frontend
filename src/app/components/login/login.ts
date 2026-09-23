import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  login(): void {
    if (this.loading) {
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: (response) => {
        this.auth.saveToken(response.token);
        this.router.navigate(['/dashboard']);
      },
     error: (error) => {
      console.log('Login error:', error.status);

      this.loading = false;
      this.errorMessage = 'Incorrect email or password.';

      this.cdr.detectChanges();
    }
    });
  }
}