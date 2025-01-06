import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {Web3Service} from '../../services/web3.service';
import {Account} from '../../interfaces/account';

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
export class NavbarComponent implements OnInit {

  userAccount: Account | null = null; // The wallet address of the logged-in user
  dropdownVisible: boolean = false;
  userName: string = 'Guest'; // Placeholder name (can be replaced with fetched user data)

  constructor(private authService: AuthService, private router: Router, private web3Service: Web3Service) {
  }

  async ngOnInit() {
    console.log('Navbar Component Initialized');
    // Check if the user is signed in
    if (this.web3Service.isMetaMaskConnected()) {
      console.log('User is signed in');
      console.log('Connected Account:', this.web3Service.getConnectedAccount());
      this.userAccount = this.web3Service.getConnectedAccount();
      // Optional: Fetch the user's name from the blockchain if available
      this.userName = 'Donor'; // Replace with actual logic to fetch name
    }
  }

  // Connect Wallet Functionality
  async connectWallet() {
    const isConnected = await this.web3Service.connectMetaMask();
    if (isConnected) {
      this.userAccount = this.web3Service.getConnectedAccount();
      this.userName = 'Donor'; // Replace with actual logic to fetch name
    }
  }

  // Logout Functionality
  logout() {
    this.authService.logout();
    this.userAccount = null;
    this.userName = 'Guest'; // Reset the user to Guest
    this.router.navigate(['/sign-in']).then(r => {
      console.log('Redirected to Sign-In page');
    });
  }

  // Toggle Dropdown Menu
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  closeDropdown() {
    this.dropdownVisible = false;
  }
}
