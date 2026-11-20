import { input, afterNextRender } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { ReviewService } from '../../core/services/review/review.service';
import { Review } from '../../core/models/review.interface';
import { Component, inject, signal } from '@angular/core';
@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
})
export class ReviewsComponent {
  readonly productId = input('');
  private readonly authService = inject(AuthService);
  private readonly reviewService = inject(ReviewService);
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    review: ['', Validators.required],
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
  });
  readonly reviews = signal<Review[]>([]);
  readonly userId = signal('');
  readonly editId = signal('');
  readonly busy = signal(false);
  readonly message = signal('');
  page = 1;
  pages = 1;
  constructor() {
    afterNextRender(() => {
      if (localStorage.getItem('token'))
        this.authService.verifyToken().subscribe({
          next: (res) => this.userId.set(res.decoded.id),
          error: () => this.userId.set(''),
        });
    });
  }
  ngOnInit(): void {
    this.getReviews(1);
  }
  getReviews(page: number): void {
    this.busy.set(true);
    const request = this.productId()
      ? this.reviewService.getProductReviews(this.productId(), page)
      : this.reviewService.getAllReviews(page);
    request.subscribe({
      next: (res) => {
        this.reviews.set(res.data);
        this.message.set(res.data.length ? '' : 'No reviews yet.');
        this.page = page;
        this.pages = res.metadata?.numberOfPages || 1;
        this.busy.set(false);
      },
      error: (err) => this.showError(err),
    });
  }
  editReview(id: string): void {
    this.busy.set(true);
    this.reviewService.getReview(id).subscribe({
      next: (res) => {
        this.form.patchValue(res.data);
        this.editId.set(id);
        this.busy.set(false);
      },
      error: (err) => this.showError(err),
    });
  }
  cancelEdit(): void {
    this.form.reset();
    this.editId.set('');
  }
  saveReview(): void {
    if (this.form.invalid || this.busy()) return;
    this.busy.set(true);
    const data = this.form.getRawValue();
    const request = this.editId()
      ? this.reviewService.updateReview(this.editId(), data)
      : this.reviewService.addReview(this.productId(), data);
    request.subscribe({
      next: () => {
        this.cancelEdit();
        this.getReviews(1);
      },
      error: (err) => this.showError(err),
    });
  }
  deleteReview(id: string): void {
    this.busy.set(true);
    this.reviewService.deleteReview(id).subscribe({
      next: () => {
        this.cancelEdit();
        this.getReviews(1);
      },
      error: (err) => this.showError(err),
    });
  }
  private showError(err: { error?: { message?: string } }): void {
    this.message.set(err.error?.message || 'Could not complete the review request.');
    this.busy.set(false);
  }
}
