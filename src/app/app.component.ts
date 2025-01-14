import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent  implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.checkSessionExpiration();
  }
  

  title = 'Tawelti Restaurant dashboard';
}
