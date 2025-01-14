import { Component, OnInit } from '@angular/core';
import { CategoryService, Category } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from 'src/app/material.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MaterialModule,
    MatSnackBarModule,
    MatChipsModule,
    ReactiveFormsModule
  ],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  categoryId: string | null = null;
  categoryData: Category[] = [];
  isDialogOpen: boolean = false;
  categoryForm: FormGroup;
  restaurantId: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getRestaurantId();
    if (this.restaurantId) {
      this.fetchCategoryDetails();
    }
  }

  getRestaurantId(): void {
    this.restaurantId = sessionStorage.getItem('restaurantId');
  }

  fetchCategoryDetails(): void {
    if (!this.restaurantId) return;

    this.categoryService.getCategories(this.restaurantId).subscribe({
      next: (data: Category[]) => {
        this.categoryData = data;
       },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  openDialog(): void {
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.categoryForm.reset();
  }

  addCategory(): void {
    if (!this.restaurantId || this.categoryForm.invalid) {
      this.showSnackbar("Veuillez remplir tous les champs.", "error");
      return;
    }

    this.categoryService.addCategory(this.restaurantId, this.categoryForm.value.name).subscribe({
      next: (response) => {
        this.categoryData.push(response.category);
        this.showSnackbar("Catégorie ajoutée avec succès !", "success");
        this.closeDialog();
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout de la catégorie:', err);
        this.showSnackbar("Erreur lors de l'ajout de la catégorie.", "error");
      }
    });
  }

  showSnackbar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }
}
