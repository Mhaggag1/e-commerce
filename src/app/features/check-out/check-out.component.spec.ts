import { provideTranslateService } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckOutComponent } from './check-out.component';

describe('CheckOutComponent', () => {
  let component: CheckOutComponent;
  let fixture: ComponentFixture<CheckOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckOutComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideTranslateService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckOutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('submits a cash order once with the active cart and shipping address', () => {
    const http = TestBed.inject(HttpTestingController);
    http
      .expectOne((req) => req.url.endsWith('/api/v2/cart'))
      .flush({ data: { _id: 'cart-1', products: [{}] } });
    http.expectOne((req) => req.url.endsWith('/api/v1/addresses')).flush({ data: [] });
    component.form.setValue({
      details: 'Main street',
      city: 'Cairo',
      phone: '01000000000',
      postalCode: '12345',
    });
    component.placeOrder();
    component.placeOrder();
    const order = http.expectOne((req) => req.url.endsWith('/api/v2/orders/cart-1'));
    expect(order.request.method).toBe('POST');
    expect(order.request.body).toEqual({ shippingAddress: component.form.getRawValue() });
    order.flush({}, { status: 400, statusText: 'Rejected' });
    expect(component.submitting()).toBe(false);
    component.method.set('card');
    component.placeOrder();
    const session = http.expectOne((req) =>
      req.url.endsWith('/api/v1/orders/checkout-session/cart-1'),
    );
    expect(session.request.params.get('url')).toBe(window.location.origin);
    session.flush({ session: {} });
    expect(component.submitting()).toBe(false);
    http.verify();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
