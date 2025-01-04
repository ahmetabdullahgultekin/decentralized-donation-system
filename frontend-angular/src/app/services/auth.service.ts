import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // Replace with your backend URL
  private userProfileObj: any =
    {
      name: 'John Doe',
      address: 'johndoe@example.com',
      reputation: 950,
      badges: [{type: 'Silver'}, {type: 'Gold'}, {type: 'Premium'}],
      activityHistory: [
        {date: '2025-01-01', description: 'Donated 50 DTN to Save The Ocean.'},
        {date: '2025-01-02', description: 'Earned Gold Badge for reputation 900+.'},
        {date: '2025-01-03', description: 'Revealed donation to Green Earth Fund.'},
      ],
    };

  /*
  constructor(private http: HttpClient) {
  }

  // Sign Up Method
  signUp(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, {email, password});
  }

  // Sign In Method
  signIn(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, {email, password});
  }
  */

  // Store Token in Local Storage
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Get Token from Local Storage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Logout Method
  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Get User Data
  getUser(): any {
    return this.userProfileObj;
  }

  // Check if User is Logged In
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
