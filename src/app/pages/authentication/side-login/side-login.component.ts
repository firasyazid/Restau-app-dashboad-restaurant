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
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';   
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule, MatSnackBarModule, CommonModule
  ],
  templateUrl: './side-login.component.html',
  styleUrls: ['./side-login.component.scss']   

})
export class AppSideLoginComponent {
  constructor(private router: Router, private authService: AuthService, private snackBar: MatSnackBar) {}

   form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      return;  
    }
  
    const loginData = {
      email: this.form.value.email as string,
      password: this.form.value.password as string,
    };
  
     this.authService.login(loginData).subscribe(
      (response) => {
        console.log('Login successful:', response);
  
         this.snackBar.open('Login successful!', 'Close', {
          duration: 3000,  
          panelClass: ['success-snackbar'],  
        });
  
         this.authService.setToken(response.token);
  
         if (response.user && response.user.restaurant && response.user.restaurant.id) {
          this.authService.setRestaurantId(response.user.restaurant.id);
        }
        if (response.user && response.user.role) {
          this.authService.setUserRole(response.user.role);
        }
         this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Login failed:', error);
  
   
         if (error.error.message === 'Access denied. Only owners or admins can log in.') {
          this.snackBar.open('Accès refusé. Seuls les propriétaires ou les administrateurs peuvent se connecter.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],  
          });
        }
         else if (error.error.message === 'Restaurant is not activated. Please contact support.') {
          this.snackBar.open('Le restaurant n\'est pas activé. Veuillez contacter le support.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],  
          });
        }
         else {
          this.snackBar.open('Identifiants invalides. Veuillez réessayer.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],  
          });
        }
      }
    );
  }
  
}
