export class ApiError extends Error {
  constructor(public status: number, public message: string, public details?: any) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
