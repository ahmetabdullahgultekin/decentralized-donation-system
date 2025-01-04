import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {LoadingService} from '../../services/loading.service';
import {MetaMaskService} from '../../services/metamask.service';
import {AuthService} from '../../services/auth.service';
import {Account} from '../../interfaces/account';
import {Profile} from '../../interfaces/profile';

@Component({
  selector: 'app-dashboard-page',
  imports: [NgForOf, NgClass, NgIf],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPageComponent implements OnInit {
  userProfileObj: Profile = {
    name: '',
    level: '',
    reputation: 0,
    address: '',
    badges: [],
    activityHistory: [],
  }

  userAccountObj: Account = {
    address: '',
    networkId: (BigInt(0)),
    balance: '',
  }

  constructor(
    private metaMaskService: MetaMaskService,
    private authService: AuthService,
    private loadingService: LoadingService
  ) {
  }

  async connectWallet() {
    this.loadingService.show();

    try {
      // Connect to MetaMask
      this.userAccountObj = await this.metaMaskService.connectMetaMask() || this.userAccountObj;
    } catch (error) {
      console.error('Error during wallet connection:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  ngOnInit() {
    this.initialize();
  }

  private initialize() {
    // Update all variables
    this.userProfileObj = this.authService.getUser();
    this.userAccountObj = this.metaMaskService.getConnectedAccount() || this.userAccountObj;

    // Monitor account or network changes
    this.metaMaskService.monitorChanges((account) => {
      if (!account) {
        alert('MetaMask disconnected. Please reconnect your wallet.');
      }
      if (this.userAccountObj && account) {
        this.userAccountObj.address = account;
      }
    });
  }
}
