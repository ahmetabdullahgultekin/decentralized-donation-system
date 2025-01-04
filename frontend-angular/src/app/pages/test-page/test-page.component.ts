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
  contractAddress: string = '0xd9145CCE52D386f254917e481eB44e9943F39138';

  userAccountObj: Account | null = null;

  constructor(
    private metaMaskService: MetaMaskService,
    private loadingService: LoadingService
  ) {
  }

  async ngOnInit() {
    this.loadingService.show();

    try {
      // Connect MetaMask
      this.userAccountObj = await this.metaMaskService.connectMetaMask();

      // Initialize the contract if the wallet is connected
      if (this.userAccountObj) {
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
    } finally {
      this.loadingService.hide();
    }
  }

  // Retrieve the stored value
  async getStoredValue() {
    this.loadingService.show();
    try {
      const value = await this.contract.methods.retrieve().call();
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

      // Call the store function
      const result = await this.contract.methods.store(newValue).send({
        from: this.userAccountObj.address,
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
