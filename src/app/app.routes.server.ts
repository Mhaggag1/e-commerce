import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  ...['account', 'change-password', 'check-out', 'orders', 'allorders'].map(
    (path): ServerRoute => ({ path, renderMode: RenderMode.Client }),
  ),
  ...['shop', 'brands', 'categories', 'reviews'].map((path): ServerRoute => ({
    path,
    renderMode: RenderMode.Server,
  })),
  {
    path: 'product-details/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
