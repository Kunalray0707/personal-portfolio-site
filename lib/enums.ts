export enum Interval {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  LIFETIME = 'LIFETIME'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  PAST_DUE = 'PAST_DUE'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum TicketPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum AnnouncementType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  SUCCESS = 'SUCCESS'
}
