import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private isAuthenticated: boolean = false;
  private userAccount: string | null = null;

  constructor() {
  }

  // Check if the user is signed in
  isSignedIn(): boolean {
    return this.isAuthenticated;
  }

  // Get the connected user's account
  getUserAccount(): string | null {
    return this.userAccount;
  }

  // Log out the user
  logout(): void {
    this.isAuthenticated = false;
    this.userAccount = null;
  }
}
