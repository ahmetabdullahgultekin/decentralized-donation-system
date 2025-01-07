import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Web3Service} from '../../services/web3.service';
import {Account} from '../../interfaces/account';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-organizations-page',
  imports: [
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './organizations-page.component.html',
  styleUrl: './organizations-page.component.css'
})
export class OrganizationsPageComponent implements OnInit {
  organizations: any[] = []; // Array to store organization details
  web3: any;
  userAccount: Account | null = null;
  errorMessage: string | null = null;
  loading = false;

  constructor(private web3Service: Web3Service, private router: Router) {
  }

  async ngOnInit() {
    try {
      this.loading = true;
      this.errorMessage = null;

      this.userAccount = this.web3Service.getConnectedAccount();

      // Fetch organizations
      this.organizations = await this.web3Service.getOrganizations();

    } catch (error) {
      console.error('Error fetching organizations:', error);
      this.errorMessage = 'Failed to load organizations. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  async loadOrganizations() {
    this.organizations = await this.web3Service.getOrganizations();
    window.location.reload();
  }

  /*
  async loadOrganizations() {
    this.loading = true;
    this.errorMessage = null;

    try {
      const count = await this.web3Service.createContractInstance(0).methods.getOrganizationCount().call(
        {from: organizationContractAddress},
      ); // Get total number of organizations
      const organizationList = [];

      for (let i = 0; i < count; i++) {
        const organization = await this.web3Service.createContractInstance(0).methods.getOrganization(i).call(
          {from: organizationContractAddress},
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
      this.web3Service.organizations = organizationList;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      this.errorMessage = 'Failed to load organizations. Please try again.';
    } finally {
      this.loading = false;
    }
  }

   */
}
