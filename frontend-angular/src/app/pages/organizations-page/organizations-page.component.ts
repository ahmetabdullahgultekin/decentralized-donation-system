import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Web3Service} from '../../services/web3.service';
import {Account} from '../../interfaces/account';

@Component({
  selector: 'app-organizations-page',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './organizations-page.component.html',
  styleUrl: './organizations-page.component.css'
})
export class OrganizationsPageComponent implements OnInit {
  organizations: any[] = []; // Array to store organization details
  web3: any;
  userAccount: Account | null = null;
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(private web3Service: Web3Service) {
  }

  async ngOnInit() {
    try {
      this.userAccount = this.web3Service.getConnectedAccount();

      if (this.userAccount) {
        // Fetch organizations
        await this.loadOrganizations();
      }
    } catch (error) {
      alert('Error initializing organizations page. Please try again.' + error);
      console.error('Error initializing organizations page:', error);
    }
  }

  async loadOrganizations() {
    this.loading = true;
    this.errorMessage = null;

    try {
      const count = await this.web3Service.getContract().methods.getOrganizationCount().call(
        {from: this.web3Service.getContractAddress()},
      ); // Get total number of organizations
      const organizationList = [];

      for (let i = 0; i < count; i++) {
        const organization = await this.web3Service.getContract().methods.getOrganization(i).call(
          {from: this.web3Service.getContractAddress()},
        );
        organizationList.push({
          id: organization.id,
          name: organization.name,
          wallet: organization.wallet,
          reputation: organization.reputation,
          level: this.getLevelName(organization.level),
        });
      }

      this.organizations = organizationList;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      this.errorMessage = 'Failed to load organizations. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  getLevelName(level: number): string {
    switch (Number(level)) {
      case Number(0):
        return 'Bronze';
      case Number(1):
        return 'Silver';
      case Number(2):
        return 'Gold';
      case Number(3):
        return 'Platinum';
      case Number(4):
        return 'Diamond';
      default:
        return 'Unknown';
    }
  }
}
