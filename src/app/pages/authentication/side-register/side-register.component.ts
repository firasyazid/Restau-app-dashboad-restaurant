import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AuthService } from '../../../services/auth.service';   
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-side-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule,MatSnackBarModule,CommonModule],
  templateUrl: './side-register.component.html',
  styleUrls: ['./side-register.component.scss']   

})
export class AppSideRegisterComponent {
  constructor(private router: Router, private authService: AuthService , 

    private snackBar: MatSnackBar

  ) {}

   form = new FormGroup({
    ownerName: new FormControl('', [Validators.required, Validators.minLength(6)]),
    ownerEmail: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),  // Minimum length of 8
    restaurantName: new FormControl('', [Validators.required]),
  });

   get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      return; 
    }
  
     const formData = {
      ownerName: this.form.value.ownerName,
      ownerEmail: this.form.value.ownerEmail,
      password: this.form.value.password,
      restaurantName: this.form.value.restaurantName,
    };
  
     this.authService.registerRestaurant(formData).subscribe(
      (response) => {
          this.snackBar.open('Restaurant registered successfully!', 'Close', {
          duration: 3000, // Show snackbar for 3 seconds
          panelClass: ['success-snackbar'], // Custom class for styling
        });
        this.authService.setToken(response.token);

         if (response.user.restaurant && response.user.restaurant.id) {
          this.authService.setRestaurantId(response.user.restaurant.id);
        }
         this.router.navigate(['/authentication/login']);
      },
      (error) => {
        console.error('Registration failed:', error);
        
         if (error.error.message === 'Restaurant with this name already exists') {
           this.snackBar.open('Restaurant name already exists. Please choose a different name.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        } else if (error.error.message === 'Email already exists') {
           this.snackBar.open('Email already exists. Please use a different email.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        } else {
           this.snackBar.open('Registration failed. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        }
      }
    );
  }
  

}
