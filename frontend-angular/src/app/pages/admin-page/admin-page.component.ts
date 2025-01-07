import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Web3Service} from '../../services/web3.service';
import {SmartContract} from '../../interfaces/smart.contract';

@Component({
  selector: 'app-admin-page',
  imports: [
    FormsModule,
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit {
  // Organization Object
  organization = {
    name: '',
    address: '',
    level: 0
  };

  selectedContractIndex: number = 0; // Default selected contract
  contractTypes: SmartContract[] = []; // Array to store contract
  updatedAddress: string = ''; // Address to be entered by the admin
  updatedAbi: string = ''; // ABI to be entered by the admin

  // Stored current details (replace these with fetched values from a database or API)
  contractAddress: string = '0x123456789abcdef'; // Example address
  contractAbi: string = '[{ "type": "function", "name": "example" }]'; // Example ABI

  donorAddress: string = '';
  //donations: Organization = [];
  selectedDonationId: number | null = null;


  constructor(private web3Service: Web3Service) {
    this.contractTypes = this.web3Service.contracts.map((contract) => {
      return {
        name: contract.name,
        address: contract.address,
        abi: JSON.stringify(contract.abi, null, 2),
      };
    });
  }

  ngOnInit(): void {
    this.loadContractDetails();
  }

  addOrganization() {
    if (
      this.organization.name &&
      this.organization.address &&
      this.organization.level
    ) {
      this.web3Service.addOrganization(
        this.organization.name,
        this.organization.address,
        this.organization.level
      ).then(r => {
        console.log('Organization added successfully.');
        alert('Organization added successfully.');
      });
      this.resetForm();
    } else {
      alert('Please fill in all required fields.');
    }
  }

  // Reset Form Function
  resetForm() {
    this.organization = {
      name: '',
      address: '',
      level: 0
    };
  }

  // Load the contract details based on the selected contract
  loadContractDetails(index: number = 0) {
    this.selectedContractIndex = index;
    console.log('Loading details for contract at index:', this.selectedContractIndex);
    this.updatedAddress = this.contractTypes[this.selectedContractIndex].address;
    this.updatedAbi = this.contractTypes[this.selectedContractIndex].abi;
    this.contractAddress = this.updatedAddress;
    this.contractAbi = this.updatedAbi;
  }

  // Save the updated contract details
  saveContractDetails() {
    // Save the updated address and ABI for the selected contract
    console.log(`Saving details for ${this.selectedContractIndex}`);
    console.log('Updated Address:', this.updatedAddress);
    console.log('Updated ABI:', this.updatedAbi);

    // Replace with actual logic to save to a database or blockchain
    this.contractAddress = this.updatedAddress;
    this.contractAbi = this.updatedAbi;

    alert('Details for contract at index ' + this.selectedContractIndex + ' saved successfully!');
  }

  // Get the display name of the selected contract
  getContractName(key: number): string {
    return this.contractTypes[key].name;
  }

  /*
  // Fetch donations for a specific donor
  async fetchDonorDonations() {
    if (!this.donorAddress) {
      alert('Please enter a donor address.');
      return;
    }

    try {
      this.donations = await this.web3Service.getDonations(this.donorAddress);
      if (this.donations.length === 0) {
        alert('No donations found for this donor.');
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      alert('Failed to fetch donations. Check the console for details.');
    }
  }

   */

  // Apply penalty for a specific donation
  async applyPenalty() {
    if (this.selectedDonationId === null) {
      alert('Please enter a donation ID.');
      return;
    }

    try {
      const tx = await this.web3Service.applyPenalty(this.donorAddress, this.selectedDonationId);
      alert('Penalty applied successfully! TX: ' + tx.transactionHash);
      //await this.fetchDonorDonations(); // Refresh the donation list
    } catch (error) {
      console.error('Error applying penalty:', error);
      alert('Failed to apply penalty. Check the console for details.');
    }
  }
}
