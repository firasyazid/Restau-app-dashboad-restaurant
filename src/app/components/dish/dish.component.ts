import { Component, OnInit } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
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
    ReactiveFormsModule
  ],
  templateUrl: './dish.component.html',
  styleUrl: './dish.component.scss'
})
export class DishComponent implements OnInit {
  restaurantId: string | null = null;
  dishesByCategory: { [key: string]: Dish[] } = {};
  categoryList: { id: string, name: string }[] = [];
  isLoading: boolean = true;
  dishForm: FormGroup;
  isDishDialogOpen: boolean = false;
  selectedImage1: File | null = null;
  selectedImage: File | null = null;
  selectedImage1Name: string = '';
  selectedImageName: string = '';


  constructor(
    private snackBar: MatSnackBar,
    private dishService: DishService,
    private fb: FormBuilder,
  ) {
    this.dishForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      availability_status: [true],
      categoryId: ['', Validators.required],

    });

  }

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
        this.dishesByCategory = data || {};

        this.categoryList = Object.keys(data).map(categoryId => {
          const firstDish = data[categoryId][0];

          return {
            id: categoryId,
            name: firstDish?.category?.name || "Nom inconnu"
          };
        });

        this.isLoading = false;
        console.log('Plats par catégorie:', this.dishesByCategory);
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


  fetchCategories(): void {
    if (!this.restaurantId) return;

    this.dishService.getCategories(this.restaurantId).subscribe({
      next: (categories) => {
        this.categoryList = categories.map(cat => ({
          id: cat._id,
          name: cat.name
        }));

      },
      error: (err) => {
        console.error('Erreur lors du chargement des catégories :', err);
        this.showSnackbar("Erreur de chargement des catégories.", "error");
      }
    });
  }

  openDishDialog(): void {
    this.fetchCategories();

    this.isDishDialogOpen = true;
  }

  closeDishDialog(): void {
    this.isDishDialogOpen = false;
    this.dishForm.reset();
  }
  // ✅ Gestion de la sélection des images
  onFileSelected(event: any, field: 'image1' | 'image'): void {
    const file = event.target.files[0];
    if (!file) return;

    if (field === 'image') {
      this.selectedImage = file;
      this.selectedImageName = file.name;
    } else if (field === 'image1') {
      this.selectedImage1 = file;
      this.selectedImage1Name = file.name;
    }
  }

  addDish(): void {
    if (!this.restaurantId || this.dishForm.invalid || !this.selectedImage) {
      this.showSnackbar("Veuillez remplir tous les champs et ajouter l'image principale.", "error");
      return;
    }

    const categoryId = this.dishForm.value.categoryId;
    const dishData = { ...this.dishForm.value };

    const formData = new FormData();
    formData.append('name', dishData.name);
    formData.append('price', dishData.price.toString());
    if (dishData.description) formData.append('description', dishData.description);
    formData.append('availability_status', dishData.availability_status.toString());

     if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

     if (this.selectedImage1) {
      formData.append('image1', this.selectedImage1);
    }

    this.dishService.addDish(this.restaurantId, categoryId, formData).subscribe({
      next: (response) => {
        if (!this.dishesByCategory[categoryId]) {
          this.dishesByCategory[categoryId] = [];
        }

        this.dishesByCategory[categoryId].push(response.dish);

        this.showSnackbar("Plat ajouté avec succès !", "success");
        this.fetchDishes();
        this.closeDishDialog();
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout du plat:', err);
        this.showSnackbar("Erreur lors de l'ajout du plat.", "error");
      }
    });
  }
}



