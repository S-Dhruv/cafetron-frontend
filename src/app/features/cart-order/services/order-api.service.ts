import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  PlaceOrderRequest,
  PlaceOrderResponse,
  MyOrderSummaryResponse,
  OrderDetailResponse,
} from '../models/order.models';
import { environment } from '../../../../environments/environment';
import { SKIP_AUTH_REDIRECT } from '../../../core/interceptors/auth.interceptor';

type OrderListPayload =
  | MyOrderSummaryResponse[]
  | {
      orders?: MyOrderSummaryResponse[];
      data?: MyOrderSummaryResponse[];
      content?: MyOrderSummaryResponse[];
    };

@Injectable({ providedIn: 'root' })
export class OrderApiService {
  private readonly API_URL = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  placeOrder(request: PlaceOrderRequest): Observable<PlaceOrderResponse> {
    console.log('POST /api/orders with:', request);
    return this.http.post<PlaceOrderResponse>(this.API_URL, request, {
      context: new HttpContext().set(SKIP_AUTH_REDIRECT, true),
    });
  }

  getMyOrders(): Observable<MyOrderSummaryResponse[]> {
    console.log('GET /api/orders');
    return this.http
      .get<OrderListPayload>(this.API_URL)
      .pipe(map((payload) => this.normalizeOrderList(payload)));
  }

  getOrderDetail(orderId: number): Observable<OrderDetailResponse> {
    console.log('GET /api/orders/' + orderId);
    return this.http.get<OrderDetailResponse>(`${this.API_URL}/${orderId}`);
  }

  processTimeout(orderId: number): Observable<OrderDetailResponse> {
    console.log('POST /api/orders/' + orderId + '/timeout');
    return this.http.post<OrderDetailResponse>(`${this.API_URL}/${orderId}/timeout`, {});
  }

  private normalizeOrderList(payload: OrderListPayload): MyOrderSummaryResponse[] {
    if (Array.isArray(payload)) {
      return payload;
    }

    return payload.orders ?? payload.data ?? payload.content ?? [];
  }
}
