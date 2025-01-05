import {Component, OnInit} from '@angular/core';
import {LoadingService} from '../../services/loading.service';
import {Web3Service} from '../../services/web3.service';
import {Account} from '../../interfaces/account';

@Component({
  selector: 'app-test-page',
  imports: [],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css',
})
export class TestPageComponent implements OnInit {

  account: Account | null = null;

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
      // Check MetaMask Connection
      if (!this.web3Service.isMetaMaskConnected()) {
        console.log('MetaMask not connected.');
        return;
      } else {
        await this.web3Service.connectMetaMask();
      }

      this.account = this.web3Service.getConnectedAccount();
      /*
            // Initialize the contract if the wallet is connected
            if (this.userAccountObj) {
              this.web3Service.initializeService();
            } else {
              console.log('MetaMask connection was canceled.');
            }

       */
    } catch (error) {
      console.error('Error initializing TestPage:', error);
    }
  }

  // Retrieve the stored value
  async getStoredValue() {
    this.loadingService.show();
    try {
      if (!this.web3Service.getContract()) {
        alert('Contract not initialized. Please connect your MetaMask wallet first.');
        return;
      }
      if (!this.web3Service.isMetaMaskConnected()) {
        alert('Please connect your MetaMask wallet first.');
        return;
      }
      const value = await this.web3Service.getContract().methods.retrieve().call(
        {from: this.web3Service.getContractAddress()}
      );
      console.log('Retrieved Value:', value);
      this.storedValue = value;
    } catch (error : any) {
      alert('Error retrieving value: ' + error.message);
      console.error('Error retrieving value:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  // Store a new value
  async storeValue(inputValue: string, inputAddress: string) {
    this.loadingService.show();
    try {
      let newValue = Number(inputValue);
      if (!this.web3Service.isMetaMaskConnected()) {
        alert('Please connect your MetaMask wallet first.');
        return;
      }

      if (!this.web3Service.getContract()) {
        alert('Contract not initialized. Please connect your MetaMask wallet first.');
        return;
      }

      if (inputAddress && this.web3Service) {
        // Call the store function
        const result = await this.web3Service.getContract().methods.store(newValue).send({
          from: this.account?.address,
          to: inputAddress,
        });
        console.log('Transaction Result:', result);
        alert(`Value ${newValue} has been stored successfully!`);
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
