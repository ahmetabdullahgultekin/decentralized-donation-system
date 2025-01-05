import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Web3Service} from '../../services/web3.service';
import Web3 from 'web3';
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
  contract: any;
  userAccount: Account | null = null;
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(private web3Service: Web3Service) {}

  async ngOnInit() {
    try {
      this.userAccount = this.web3Service.getConnectedAccount();
      this.contract = this.web3Service.getContract();

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
          id: organization[0],
          name: organization[1],
          wallet: organization[2],
          reputation: organization[3],
          level: this.getLevelName(organization[4]),
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
    switch (level) {
      case 0:
        return 'Silver';
      case 1:
        return 'Gold';
      case 2:
        return 'Premium';
      default:
        return 'Unknown';
    }
  }
}
