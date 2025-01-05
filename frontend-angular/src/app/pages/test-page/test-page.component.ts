import {Component, OnInit} from '@angular/core';
import {LoadingService} from '../../services/loading.service';
import {abi} from '../../json/abi.json';
import {MetaMaskService} from '../../services/metamask.service';
import {Account} from '../../interfaces/account';

@Component({
  selector: 'app-test-page',
  imports: [],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css',
})
export class TestPageComponent implements OnInit {
  contract: any;
  storedValue: number | null = null;

  // Replace with your contract's ABI and address
  contractAbi: any = abi;
  contractAddress: string = '0x9bfED0e49930843E039126b0BC62A5461a135bE8';

  userAccountObj: Account | null = null;

  constructor(
    private metaMaskService: MetaMaskService,
    private loadingService: LoadingService
  ) {
  }

  async ngOnInit() {
    await this.initializeTestPage();
  }

  // Initialize the Test Page
  async initializeTestPage() {
    try {
      // Connect MetaMask
      this.userAccountObj = await this.metaMaskService.connectMetaMask();

      // Initialize the contract if the wallet is connected
      if (this.userAccountObj) {
        console.log('Contract ABI:', this.contractAbi);
        this.contract = this.metaMaskService.initializeContract(
          this.contractAbi,
          this.contractAddress
        );
        console.log('Contract initialized:', this.contract);
      } else {
        console.log('MetaMask connection was canceled.');
      }
    } catch (error) {
      console.error('Error initializing TestPage:', error);
    }
  }

  // Retrieve the stored value
  async getStoredValue() {
    this.loadingService.show();
    try {
      if (!this.contract) {
        alert('Contract not initialized. Please connect your MetaMask wallet first.');
        return;
      }
      if (!this.userAccountObj) {
        alert('Please connect your MetaMask wallet first.');
        return;
      }
      const value = await this.contract.methods.retrieve().call(
        {from: this.userAccountObj.address}
      );
      console.log('Retrieved Value:', value);
      this.storedValue = value;
    } catch (error) {
      console.error('Error retrieving value:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  // Store a new value
  async storeValue(input: string) {
    this.loadingService.show();
    try {
      let newValue = Number(input);
      if (!this.userAccountObj) {
        alert('Please connect your MetaMask wallet first.');
        return;
      }

      if (!this.contract) {
        alert('Contract not initialized. Please connect your MetaMask wallet first.');
        return;
      }

      // Call the store function
      const result = await this.contract.methods.store(newValue).send({
        from: this.userAccountObj.address,
        to: this.contractAddress,
      });

      console.log('Transaction Result:', result);
      alert(`Value ${newValue} has been stored successfully!`);
    } catch (error) {
      console.error('Error storing value:', error);
    } finally {
      this.loadingService.hide();
    }
  }
}
