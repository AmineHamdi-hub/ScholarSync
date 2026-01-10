import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from "./layout/layout.component";
import { Router, RouterOutlet } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LayoutComponent, RouterOutlet, MatIconModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ScholarSync';

  constructor(private router: Router) {}

  isAuthPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/signup';
  }
}
