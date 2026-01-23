export enum TABLE_STATUS {
  AVAILABLE = 'Available',
  UNAVAILABLE = 'Unavailable',
}

export enum SESSION_STATUS {
  OPEN = 'Open',
  CLOSED = 'Closed',
}

export enum CART_STATUS {
  ACTIVE = 'Active',
  SUBMITTED = 'Submitted',
  CLOSED = 'Closed',
}

export enum ORDER_STATUS {
  NEW = 'NEW',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  PAID = 'PAID',
  CANCEL = 'CANCEL',
}

export enum ORDER_ITEM_STATUS {
  PENDING = 1,
  PREPARING = 2,
  READY = 3,
  SERVED = 4,
}
