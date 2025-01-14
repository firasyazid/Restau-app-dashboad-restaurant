import { Component, OnInit } from '@angular/core';
import { RestaurantService, Restaurant } from '../../services/restaurant.service';
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

 

@Component({
  selector: 'app-restaurant-info',
  standalone: true,
  imports: [  CommonModule,   
    MatMenuModule,
    MatButtonModule, 
    MaterialModule,
    MatSnackBarModule,
    MatChipsModule,
    MatPaginatorModule,
    ReactiveFormsModule],
  templateUrl: './restaurant-info.component.html',
  styleUrls: ['./restaurant-info.component.scss']
})
export class RestaurantInfoComponent implements OnInit {
  restaurantId: string | null = null;
   restaurantData: Restaurant | null = null;  
   displayedColumns: string[] = [
    'name', 'logo', 'uri', 'owner', 'numberOfTables', 'isActive', 
    'updteamenu', 'users', 'customers', 'menu', 'createdAt', 'actions'
  ]; 

  adminForm: FormGroup;

  isDialogOpen2: boolean = false;


  selectedFile: File | null = null;
  isDialogOpen: boolean = false;  


  constructor(

        private restaurantService: RestaurantService ,private fb: FormBuilder,    private snackBar: MatSnackBar,

  ) { 
    this.adminForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],  
    });

  }

  ngOnInit(): void {
    this.getRestaurantId();
    if (this.restaurantId) {
      this.fetchRestaurantDetails();
    }  }

  getRestaurantId(): void {
    this.restaurantId = sessionStorage.getItem('restaurantId');
  }

  fetchRestaurantDetails(): void {
    if (!this.restaurantId) return;

    this.restaurantService.getRestaurantById(this.restaurantId).subscribe({
      next: (data: Restaurant) => {
        this.restaurantData = data;
        console.log('Restaurant Data:', data);
      },
      error: (err) => {
        console.error('Error fetching restaurant:', err);
      },
    });
  }
   
 


  openDialog(): void {
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  uploadLogo(): void {
    if (!this.restaurantId || !this.selectedFile) return;

    this.restaurantService.updateRestaurantLogo(this.restaurantId, this.selectedFile).subscribe({
      next: (response) => {
        if (this.restaurantData) {
          this.restaurantData.logo = response.restaurant.logo; 
        }
        this.selectedFile = null;
        this.closeDialog(); 
      },
      error: (err) => {
        console.error('Error updating logo:', err);
      },
    });
  }


  openDialog2(): void {
    this.isDialogOpen2 = true;
  }

  closeDialog2(): void {
    this.isDialogOpen2 = false;
    this.adminForm.reset();
  }

  addAdmin(): void {
    const userRole = localStorage.getItem('userRole');  

    if (userRole !== 'restaurantOwner') {
      this.showSnackbar("Accès refusé. Seuls les propriétaires de restaurant peuvent ajouter des administrateurs.", "error");
      return;
    }

    if (!this.restaurantId || this.adminForm.invalid) {
      this.showSnackbar("Formulaire invalide. Veuillez remplir tous les champs.", "error");
      return;
    }

    this.restaurantService.addUserToRestaurant(this.restaurantId, this.adminForm.value).subscribe({
      next: (response) => {
        if (this.restaurantData) {
          this.restaurantData.users = response.restaurant.users;
        }
        this.showSnackbar("Admin ajouté avec succès !", "success");
        this.closeDialog2();
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout de l’admin:', err);
        this.showSnackbar("Échec de l'ajout de l'admin. Veuillez réessayer.", "error");
      },
    });
}







  showSnackbar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',
    });
  }



}
