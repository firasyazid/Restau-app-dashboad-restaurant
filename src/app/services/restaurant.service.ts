import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Restaurant {
  _id: string;
  name: string;
  logo?: string;
  owner: {
    _id: string;
    name: string;
    email?: string;
  };
  uri: string;
  isActive: boolean;
  numberOfTables: number;
  users: {
    userId: {
      _id: string;
      name: string;
    };
    role: "restaurantOwner" | "admin" | "server" | "chef";
  }[];
  customers: {
    _id: string;
    name: string;
  }[];
  menu?: {
    _id: string;
    items: string[];
  };
  createdAt: string;
  updatedAt?: string;
  updteamenu?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private apiUrl = 'http://localhost:3003/api/v1/restaurants';  

  constructor(private http: HttpClient) {}

   getRestaurantById(restaurantId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${restaurantId}`);
  }
  updateRestaurantLogo(restaurantId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append("logo", file);

    return this.http.put<any>(`${this.apiUrl}/${restaurantId}/logo`, formData);
  }

  addUserToRestaurant(restaurantId: string, userData: { username: string; email: string; password: string; role: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${restaurantId}/add-user`, userData);
  }
}
