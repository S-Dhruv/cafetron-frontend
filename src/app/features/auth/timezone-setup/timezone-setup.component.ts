import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TimeZoneOption, TimeZoneService } from '../../cart-order/services/timezone.service';

@Component({
  selector: 'app-timezone-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './timezone-setup.component.html',
  styleUrl: './timezone-setup.component.css',
})
export class TimezoneSetupComponent implements OnInit {
  selectedTimeZone = 'Asia/Kolkata';
  timeZoneOptions: TimeZoneOption[] = [];
  isLoading = false;
  errorMessage = '';

  private readonly timezoneStorageKey = 'cafetron_timezone';
  private readonly defaultTimeZoneOptions = [
    'Asia/Kolkata',
    'UTC',
    'Asia/Dubai',
    'Asia/Singapore',
    'Europe/London',
    'Europe/Berlin',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Australia/Sydney',
  ];

  constructor(
    private timeZoneService: TimeZoneService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
    const storedTimeZone = localStorage.getItem(this.timezoneStorageKey);

    this.selectedTimeZone = this.isValidTimeZone(storedTimeZone)
      ? storedTimeZone as string
      : detectedTimeZone;
    this.timeZoneOptions = this.toTimeZoneOptions([this.selectedTimeZone, detectedTimeZone, ...this.defaultTimeZoneOptions]);
    this.loadTimeZoneOptions(detectedTimeZone);
  }

  continue(): void {
    if (!this.isValidTimeZone(this.selectedTimeZone)) {
      this.errorMessage = 'Please select a valid timezone.';
      return;
    }

    localStorage.setItem(this.timezoneStorageKey, this.selectedTimeZone);
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || this.authService.getDefaultRoute();
    this.router.navigateByUrl(returnUrl);
  }

  selectTimeZone(timeZone: string): void {
    this.selectedTimeZone = timeZone;
    this.errorMessage = '';
  }

  getTimeZoneLabel(timeZone: string): string {
    const option = this.timeZoneOptions.find((item) => item.id === timeZone);
    return option ? `${option.label} (${option.offset})` : timeZone.replace(/_/g, ' ');
  }

  getVisibleTimeZoneOptions(): TimeZoneOption[] {
    return this.timeZoneOptions.slice(0, 12);
  }

  private loadTimeZoneOptions(detectedTimeZone: string): void {
    this.isLoading = true;
    this.timeZoneService.getTimeZones().subscribe({
      next: (options) => {
        const apiOptions = options.filter((option) => this.isValidTimeZone(option.id));
        const optionMap = new Map<string, TimeZoneOption>();

        [...this.toTimeZoneOptions([this.selectedTimeZone, detectedTimeZone]), ...apiOptions]
          .forEach((option) => optionMap.set(option.id, option));

        this.timeZoneOptions = Array.from(optionMap.values());
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  private toTimeZoneOptions(timeZones: string[]): TimeZoneOption[] {
    return Array.from(new Set(timeZones))
      .filter((timeZone): timeZone is string => this.isValidTimeZone(timeZone))
      .map((timeZone) => ({
        id: timeZone,
        label: timeZone.replace(/_/g, ' '),
        offset: this.getTimeZoneShortName(timeZone),
      }));
  }

  private isValidTimeZone(timeZone: string | null | undefined): timeZone is string {
    if (!timeZone) {
      return false;
    }

    try {
      Intl.DateTimeFormat('en-US', { timeZone }).format(new Date());
      return true;
    } catch {
      return false;
    }
  }

  private getTimeZoneShortName(timeZone: string): string {
    const formattedParts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'short',
    }).formatToParts(new Date());

    return formattedParts.find((part) => part.type === 'timeZoneName')?.value || timeZone;
  }
}
