import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Web3Service} from '../../services/web3.service';
import {NgForOf} from '@angular/common';
import {SmartContract} from '../../interfaces/smart.contract';

@Component({
  selector: 'app-admin-page',
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit {
  // Predefined contract types (Donation, BadgeNFT, etc.)

  selectedContractIndex: number = 0; // Default selected contract
  contractTypes: SmartContract[] = []; // Array to store contract
  updatedAddress: string = ''; // Address to be entered by the admin
  updatedAbi: string = ''; // ABI to be entered by the admin

  // Stored current details (replace these with fetched values from a database or API)
  contractAddress: string = '0x123456789abcdef'; // Example address
  contractAbi: string = '[{ "type": "function", "name": "example" }]'; // Example ABI

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
}
