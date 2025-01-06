import {Component, OnInit} from '@angular/core';
import {LoadingService} from '../../services/loading.service';
import {Web3Service} from '../../services/web3.service';
import {Account} from '../../interfaces/account';
import {testContractAddress} from '../../jsons/test.store.address.abi';
import {FormsModule} from '@angular/forms';
import Web3 from 'web3';

@Component({
  selector: 'app-test-page',
  imports: [
    FormsModule
  ],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css',
})
export class TestPageComponent implements OnInit {

  contract: any = null;
  account: Account | null = null;
  inputValue: string = '';
  inputAddress: string = '';

  storedValue: number | null = null;

  constructor(
    protected web3Service: Web3Service,
    private loadingService: LoadingService,
  ) {
  }

  async ngOnInit() {
    await this.initializeTestPage();
  }

  // Initialize the Test Page
  async initializeTestPage() {
    try {
      this.contract = this.web3Service.createContractInstance(2);
      this.account = this.web3Service.getConnectedAccount();
    } catch (error) {
      console.error('Error initializing TestPage:', error);
    }
  }

  // Retrieve the stored value
  async getStoredValue() {
    this.loadingService.show();
    try {
      if (!this.contract) {
        alert('SmartContract not initialized. Please connect your MetaMask wallet first.');
        return;
      }
      const value = await this.contract.methods.retrieve().call(
        {from: testContractAddress}
      );
      console.log('Retrieved Value:', value);
      this.storedValue = value;
    } catch (error: any) {
      alert('Error retrieving value: ' + error.message);
      console.error('Error retrieving value:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  // Store a new value
  async storeValue() {
    this.loadingService.show();
    try {

      const web3 = new Web3();
      const commitment = web3.utils.soliditySha3(
        {t: 'uint256', v: this.inputValue},
        {t: 'address', v: this.inputAddress},
      );

      alert(`Commitment: ${commitment}`);
      if (commitment) {
        return;
      }

      if (!this.contract) {
        alert('SmartContract not initialized. Please connect your MetaMask wallet first.');
        return;
      }

      if (this.inputAddress && this.web3Service) {
        // Call the store function
        const result = await this.contract.methods.store(this.inputValue).send({
          from: testContractAddress,
          to: this.inputAddress,
        });
        console.log('Transaction Result:', result);
        alert(`Value ${this.inputValue} has been stored successfully!`);
      } else {
        alert('Please enter a valid contract address.');
      }
    } catch (error: any) {
      alert('Error storing value: ' + error.message);
      console.error('Error storing value:', error);
    } finally {
      this.loadingService.hide();
    }
  }
}
