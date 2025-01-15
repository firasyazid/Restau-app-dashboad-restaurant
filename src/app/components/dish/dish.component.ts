import { Component, OnInit } from '@angular/core';
 import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from 'src/app/material.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
 import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DishService, Dish } from '../../services/dish.service';

 
@Component({
  selector: 'app-dish',
  standalone: true,
  imports: [  
    CommonModule,   
    MatMenuModule,
    MatButtonModule, 
    MaterialModule,
    MatSnackBarModule,
    MatChipsModule,
    MatPaginatorModule,
    ReactiveFormsModule],  templateUrl: './dish.component.html',
  styleUrl: './dish.component.scss'
})
export class DishComponent implements OnInit {
  restaurantId: string | null = null;
  dishesByCategory: { [key: string]: Dish[] } = {}; // ✅ Initialisé avec un objet vide
  isLoading: boolean = true;

  constructor(
    private snackBar: MatSnackBar, 
    private dishService: DishService
  ) {}

  ngOnInit(): void {
    this.getRestaurantId();
    if (this.restaurantId) {
      this.fetchDishes();
    }
  }

  getRestaurantId(): void {
    this.restaurantId = sessionStorage.getItem('restaurantId');
  }

  fetchDishes(): void {
    if (!this.restaurantId) return;

    this.dishService.getDishesByCategory(this.restaurantId).subscribe({
      next: (data) => {
        this.dishesByCategory = data || {}; // ✅ Vérification et initialisation si vide
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des plats :', err);
        this.isLoading = false;
        this.showSnackbar("Erreur de chargement des plats.", "error");
      }
    });
  }

  showSnackbar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',
    });
  }
}
