import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../models/auth.models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {

  formData: RegisterRequest = {
    name: '',
    email: '',
    password: '',
    employeeId: '',
    department: '',
    role: 'EMPLOYEE'
  };

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.authService.register(this.formData).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.isLoading = false;
          this.successMessage = 'Account created successfully!';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.isLoading = false;
          this.errorMessage =
            err.error?.error || 'Registration failed. Please try again.';
        });
      }
    });
  }
}