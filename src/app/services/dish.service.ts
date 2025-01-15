import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Dish {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  availability_status: boolean;
  category: { _id: string; name: string };
}

@Injectable({
  providedIn: 'root'
})
export class DishService {
  private apiUrl = 'http://localhost:3003/api/v1/dishes';

  constructor(private http: HttpClient) {}

   getDishesByCategory(restaurantId: string): Observable<{ [key: string]: Dish[] }> {
    return this.http.get<{ [key: string]: Dish[] }>(`${this.apiUrl}/${restaurantId}/dishes-by-category`);
  }

  // ✅ Ajouter un nouveau plat à une catégorie
  addDish(restaurantId: string, categoryId: string, dishData: Partial<Dish>): Observable<{ message: string; dish: Dish }> {
    return this.http.post<{ message: string; dish: Dish }>(
      `${this.apiUrl}/${restaurantId}/categories/${categoryId}`,
      dishData
    );
  }

  // ✅ Supprimer un plat
  deleteDish(restaurantId: string, dishId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${restaurantId}/dishes/${dishId}`);
  }
}
