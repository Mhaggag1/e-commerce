export interface ReviewForm {
  review: string;
  rating: number;
}
export interface Review extends ReviewForm {
  _id: string;
  user: { _id: string; name: string };
}
