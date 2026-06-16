import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { APP_ROLES, LoginRequest } from '../../../models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  credentials: LoginRequest = {
    employeeId: '',
    password: ''
  };

  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.isLoading = true;
    this.cdr.detectChanges();

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.redirectByRole(response.role);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Invalid email or password';
        this.cdr.detectChanges();
      }
    });
  }

  private redirectByRole(role: string): void {
    switch (role) {
      case APP_ROLES.admin:
        this.router.navigate(['/admin']);
        break;
      case APP_ROLES.counter:
        this.router.navigate(['/counter']);
        break;
      case APP_ROLES.vendor:
        this.router.navigate(['/menu/manage']);
        break;
      default:
        this.router.navigate(['/menu']);
    }
  }
}