export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role?: 'admin' | 'superadmin' | 'kopale';
}
