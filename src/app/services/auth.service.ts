import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3003/api/v1/restaurants';

  constructor(private http: HttpClient , 
    private router: Router

  ) {}

  // User Registration
  registerRestaurant(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register2`, data);
  }

  // User Login
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login2`, credentials);
  }

  // Store User Token
  setToken(token: string): void {
    const loginTime = new Date().getTime();   
    localStorage.setItem('authToken', token);
    localStorage.setItem('loginTime', loginTime.toString());  
    
    this.startAutoLogout();
  }

  startAutoLogout(): void {
    const threeHours = 3 * 60 * 60 * 1000;  // 3 hours in milliseconds

    setTimeout(() => {
      this.logout();  // Logout the user after 3 hours
    }, threeHours);
  }
  checkSessionExpiration(): void {
    const loginTime = localStorage.getItem('loginTime');

    if (loginTime) {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - parseInt(loginTime, 10);  // Time since login

      const threeHours = 3 * 60 * 60 * 1000;  // 3 hours

      if (elapsedTime >= threeHours) {
        this.logout();  // Auto logout if session expired
      } else {
        // Schedule logout for remaining time
        setTimeout(() => {
          this.logout();
        }, threeHours - elapsedTime);
      }
    }
  }


  // Get User Token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Store Restaurant ID
  setRestaurantId(restaurantId: string): void {
    sessionStorage.setItem('restaurantId', restaurantId); // Use sessionStorage for temporary storage
  }

  // Get Restaurant ID
  getRestaurantId(): string | null {
    return sessionStorage.getItem('restaurantId');
  }

   

  // ✅ Logout Function
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loginTime');  // Remove login time
    this.router.navigate(['/authentication/login']);  // Redirect to login
  }

}