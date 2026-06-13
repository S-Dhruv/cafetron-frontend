import { Component } from '@angular/core';
import { Route, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

@Component({
  standalone: true,
  template: '',
})
class PendingFeatureRouteComponent {}

type FeatureRouteOptions = {
  path: string;
  title: string;
  componentPath: string;
};

const featureRoute = ({
  path,
  title,
  componentPath,
}: FeatureRouteOptions): Route => ({
  path,
  title,
  canActivate: [authGuard],
  component: PendingFeatureRouteComponent,
  data: {
    componentPath,
  },
});

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',        // ← changed from 'menu' to 'login'
  },

  // ── YOUR ROUTES (auth) ──────────────────────────────────────────
  {
    path: 'login',
    title: 'Login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.LoginComponent),
  },
  {
    path: 'register',
    title: 'Register',
    loadComponent: () =>
      import('./features/auth/register/register')
        .then(m => m.RegisterComponent),
  },

  // ── TEAMMATES' ROUTES (unchanged, just added authGuard) ─────────
  featureRoute({
    path: 'menu',
    title: 'Menu',
    componentPath: 'features/menu/menu-browse/menu-browse.component',
  }),
  featureRoute({
    path: 'menu/manage',
    title: 'Manage Menu',
    componentPath: 'features/menu/menu-manage/menu-manage.component',
  }),
  featureRoute({
    path: 'cart',
    title: 'Cart',
    componentPath: 'features/cart-order/cart/cart.component',
  }),
  featureRoute({
    path: 'checkout',
    title: 'Checkout',
    componentPath: 'features/cart-order/checkout/checkout.component',
  }),
  featureRoute({
    path: 'orders',
    title: 'Order History',
    componentPath: 'features/cart-order/order-history/order-history.component',
  }),
  featureRoute({
    path: 'wallet',
    title: 'Wallet',
    componentPath: 'features/wallet/wallet/wallet.component',
  }),
  {
    path: 'pickup',
    pathMatch: 'full',
    redirectTo: 'pickup/qr',
  },
  featureRoute({
    path: 'pickup/qr',
    title: 'Pickup QR',
    componentPath: 'features/pickup-scanner/qr-view/qr-view.component',
  }),
  {
    path: 'counter',
    pathMatch: 'full',
    redirectTo: 'counter/scanner',
  },
  featureRoute({
    path: 'counter/scanner',
    title: 'Counter Scanner',
    componentPath: 'features/pickup-scanner/scanner/scanner.component',
  }),
  featureRoute({
    path: 'counter/queue',
    title: 'Pickup Queue',
    componentPath: 'features/pickup-scanner/queue/queue.component',
  }),
  {
    path: 'admin',
    pathMatch: 'full',
    redirectTo: 'admin/dashboard',
  },
  featureRoute({
    path: 'admin/dashboard',
    title: 'Admin Dashboard',
    componentPath: 'features/admin/dashboard/dashboard.component',
  }),
  featureRoute({
    path: 'admin/operations',
    title: 'Operations',
    componentPath: 'features/admin/operations/operations.component',
  }),
  {
    path: '**',
    redirectTo: 'login',        // ← changed from 'menu' to 'login'
  },
];