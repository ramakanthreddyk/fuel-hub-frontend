export class ServiceError extends Error {
  constructor(public code: number, message: string) {
    super(message);
  }
}
