
export {};
export interface UserPayload {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isDeleted: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user: UserPayload;
    }
  }
}
