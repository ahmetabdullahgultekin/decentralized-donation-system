import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NgIf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  userName: string = 'John Doe'; // Replace with dynamic user name
  dropdownVisible: boolean = false;

  constructor(private router: Router) {
  }

  openDropdown() {
    this.dropdownVisible = true;
  }

  closeDropdown() {
    this.dropdownVisible = false;
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  logout() {
    // Add logout logic here, e.g., clearing tokens or session data
    alert('You have been logged out.');
    this.router.navigate(['/']); // Redirect to home after logout
  }
}
