import {Component} from '@angular/core';
import {donationContractAbi, donationContractAddress} from '../../json/abi.json';
import {FormsModule} from '@angular/forms';
import {Web3Service} from '../../services/web3.service';

@Component({
  selector: 'app-admin-page',
  imports: [
    FormsModule
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {
// Current contract details
  contractAddress: string = donationContractAddress;
  contractAbi: string = JSON.stringify(donationContractAbi, null, 2);

  // Temporary variables for updating
  updatedAddress: string = this.contractAddress;
  updatedAbi: string = this.contractAbi;

  constructor(private web3Service: Web3Service) {
    this.contractAddress = this.web3Service.getContractAddress();
    this.contractAbi = JSON.stringify(this.web3Service.getContractAbi(), null, 2);
    this.updatedAddress = this.contractAddress;
    this.updatedAbi = this.contractAbi;
  }

  // Save updated contract details
  saveContractDetails() {
    try {
      // Validate ABI
      const parsedAbi = JSON.parse(this.updatedAbi);

      // Save to variables (can be replaced with a backend call)
      this.contractAddress = this.updatedAddress;
      this.contractAbi = this.updatedAbi;

      this.web3Service.setABIandAddress(parsedAbi, this.updatedAddress);

      alert('Contract details saved successfully!');
    } catch (error) {
      alert('Error saving contract details: ' + error);
      console.error('Error saving contract details:', error);
    }
  }
}
