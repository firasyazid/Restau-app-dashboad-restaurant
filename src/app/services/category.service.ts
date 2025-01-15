import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Category {
  _id: string;
  name: string;
  restaurant: string;
  dishes: string[];  
  createdAt: Date;
  updatedAt?: Date;   
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:3003/api/v1/categories';

  constructor(private http: HttpClient) {}

  addCategory(restaurantId: string, categoryName: string): Observable<{ message: string; category: Category }> {
    return this.http.post<{ message: string; category: Category }>(
      `${this.apiUrl}/${restaurantId}/add-category`, 
      { name: categoryName }
    );
  }

  // ✅ Fetch all categories for a restaurant
  getCategories(restaurantId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${restaurantId}`);
  }


  deleteCategory(restaurantId: string, categoryId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }> (`${this.apiUrl}/${restaurantId}/categories/${categoryId}`)
     
  }

  updateCategory(restaurantId: string, categoryId: string, name: string): Observable<{ message: string; category: Category }> {
    return this.http.put<{ message: string; category: Category }>(
      `${this.apiUrl}/${restaurantId}/categories/${categoryId}`, 
      { name }
    );
  }
  
}
