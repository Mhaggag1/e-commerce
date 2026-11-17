import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'At Your Service - Home',
  },
  {
    path: 'brands',
    loadComponent: () => import('./features/brand/brand.component').then((m) => m.BrandComponent),
    title: 'At Your Service - brands',
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then((m) => m.CartComponent),
    title: 'At Your Service - cart',
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/categories.component').then((m) => m.CategoriesComponent),
    title: 'At Your Service - categories',
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import('./features/change-password/change-password.component').then(
        (m) => m.ChangePasswordComponent,
      ),
    title: 'At Your Service - ChangePassword',
  },
  {
    path: 'check-out',
    loadComponent: () =>
      import('./features/check-out/check-out.component').then((m) => m.CheckOutComponent),
    title: 'At Your Service - check-out',
  },
  {
    path: 'forget-password',
    loadComponent: () =>
      import('./features/forget-password/forget-password.component').then(
        (m) => m.ForgetPasswordComponent,
      ),
    title: 'At Your Service - forgetPassword',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
    title: 'At Your Service - LogIn',
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./features/orders/orders.component').then((m) => m.OrdersComponent),
    title: 'At Your Service - Orders',
  },
  {
    path: 'product-details/:id',

    loadComponent: () =>
      import('./features/product-details/productdetails.component').then(
        (m) => m.ProductdetailsComponent,
      ),
    title: 'At Your Service - Details',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/register.component').then((m) => m.RegisterComponent),
    title: 'At Your Service - Register',
  },
  {
    path: 'shop',
    loadComponent: () => import('./features/shop/shop.component').then((m) => m.ShopComponent),
    title: 'At Your Service - shop',
  },
];
