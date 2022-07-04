declare global {
  module "express-session" {
    interface Session {
      user: UserSession;
    }
  }
}

/* === Module Types === */
interface ResponseMessage {
  message: string;
  success: boolean;
}

type PositiveInt<T extends number> = number extends T
  ? never
  : `${T}` extends `-${string}` | `${string}.${string}`
  ? never
  : T;

type HttpResponseMessage = ResponseMessage & Record<string, any>;

type HttpErrorType =
  | "Bad Request"
  | "Unauthorized"
  | "Forbidden"
  | "Not Found"
  | "Conflict"
  | "Internal";

type UserType = "Renter" | "Owner";

interface LoginCreds {
  email: string;
  password: string;
  type: UserType;
}

interface SignupCreds extends LoginCreds {
  fullName: string;
  phoneNumber: string;
  extension: string;
}

interface UserSession {
  id: number;
  fullName: string;
  email: string;
  type: UserType;
}

interface Email {
  to: string;
  subject: string;
  content: string;
}

interface RecoveryRequest {
  id: string;
  password: string;
}

/* === Database Types === */
interface EntityTimestamp {
  createdAt: Date;
  updatedAt: Date;
}

type EntityID<T extends number | string> = {
  id: T;
};

type UserEntity = SignupCreds & EntityID<number> & EntityTimestamp;

type Verification = EntityID<string> & {
  userId: number;
};

type VerificationEntity = Verification & EntityTimestamp;
