import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Set JWT token for testing - Admin token (userId: 1007)
const jwtToken = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiRU1QTE9ZRUUiLCJuYW1lIjoiRTJFIFRlc3QgRW1wbG95ZWUiLCJlbXBsb3llZUlkIjoiRTJFMTAwMSIsInVzZXJJZCI6MTAwNSwiZW1haWwiOiJlMmUuZW1wbG95ZWVAY2FmZXRyb24ubG9jYWwiLCJzdWIiOiIxMDA1IiwiaWF0IjoxNzgxNjAwODAzLCJleHAiOjE3ODE2ODcyMDN9.rCYWQuQyE2h6Zdl6s_C2R9H7qhi7bEDhte6UaRZvPcY';

if (jwtToken) {
  localStorage.setItem('jwt_token', jwtToken);
  console.log('✅ JWT token set (Admin - userId: 1007)');
}

bootstrapApplication(AppComponent, appConfig).catch((error) => console.error(error));

