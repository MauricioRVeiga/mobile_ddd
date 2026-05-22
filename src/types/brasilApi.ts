export interface DddResponse {
  state: string;
  cities: string[];
}

export interface BrasilApiError {
  message: string;
  name: string;
  type: string;
}
