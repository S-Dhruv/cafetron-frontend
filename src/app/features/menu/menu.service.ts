import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuItem, MenuItemRequest, Vendor } from './menu.models';

@Injectable({ providedIn: 'root' })
export class MenuService {

  private readonly baseUrl = `${environment.apiUrl}/menu`;
  private readonly vendorUrl = `${environment.apiUrl}/vendors`;

  constructor(private http: HttpClient) {}

  // ---- employee browse ----
  getTodaysMenu(): Observable<MenuItem[]> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('auth_token')}` };
    return this.http.get<MenuItem[]>(`${this.baseUrl}/today`, { headers });
  }
  search(name: string): Observable<MenuItem[]> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('auth_token')}` };
    return this.http.get<MenuItem[]>(`${this.baseUrl}/search`, { params: { name }, headers });
  }
  filterByFoodType(type: string): Observable<MenuItem[]> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('auth_token')}` };
    return this.http.get<MenuItem[]>(`${this.baseUrl}/filter`, { params: { type }, headers });
  }

  // ---- staff management (used by the manage screen next) ----
  getAll(): Observable<MenuItem[]> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('auth_token')}` };
    return this.http.get<MenuItem[]>(this.baseUrl, { headers });
  }
  create(request: MenuItemRequest): Observable<MenuItem> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('auth_token')}` };
    return this.http.post<MenuItem>(this.baseUrl, request, { headers });
  }
  update(id: number, request: MenuItemRequest): Observable<MenuItem> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('auth_token')}` };
    return this.http.put<MenuItem>(`${this.baseUrl}/${id}`, request, { headers });
  }
  delete(id: number): Observable<void> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('auth_token')}` };
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers });
  }
  setStock(id: number, stock: number): Observable<MenuItem> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('auth_token')}` };
    return this.http.patch<MenuItem>(`${this.baseUrl}/${id}/stock`, null, { params: { stock }, headers });
  }
  setAvailability(id: number, available: boolean): Observable<MenuItem> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('auth_token')}` };
    return this.http.patch<MenuItem>(`${this.baseUrl}/${id}/availability`, null, { params: { available }, headers });
  }

  // ---- vendors (for the manage form's dropdown) ----
  getVendors(): Observable<Vendor[]> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('auth_token')}` };
    return this.http.get<Vendor[]>(`${this.vendorUrl}/active`, { headers });
  }
}