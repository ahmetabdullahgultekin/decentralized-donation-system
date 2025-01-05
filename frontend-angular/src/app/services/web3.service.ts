import {Injectable} from '@angular/core';
import Web3 from 'web3';
import {isAddress as isAddressValidator} from 'web3-validator';
import {Account} from '../interfaces/account';
import {LoadingService} from './loading.service';
import {organizationContractABI, organizationContractAddress} from '../jsons/organization.address.abi';
import {donationContractABI, donationContractAddress} from '../jsons/donation.address.abi';
import {testContractABI, testContractAddress} from '../jsons/test.store.address.abi';
import {SmartContract} from '../interfaces/smart.contract';

@Injectable({
  providedIn: 'root',
})
export class Web3Service {

  private web3: Web3 | null = null;
  private smartContracts: SmartContract[] = [];
  private accountObj: Account = {
    address: '',
    networkId: BigInt(0),
    balance: '',
  }

  constructor(private loadingService: LoadingService) {
    //this.initializeService();
  }

  get contracts(): SmartContract[] {
    return this.smartContracts;
  }

  initializeService() {
    try {
      this.web3 = new Web3((window as any).ethereum);

      this.smartContracts.push({
        name: 'Organization',
        address: organizationContractAddress,
        abi: organizationContractABI,
      });

      this.smartContracts.push({
        name: 'Donation',
        address: donationContractAddress,
        abi: donationContractABI,
      });

      this.smartContracts.push({
        name: 'Test',
        address: testContractAddress,
        abi: testContractABI,
      });
    } catch (e) {
      alert('Web3 service could not initialized! ' + e);
      console.error('Web3 service could not initialized! ', e);
    }
  }

  createContractInstance(contractIndex: number): any {
    if (!this.web3) {
      console.error('Web3 is not initialized.');
      return null;
    }
    if (contractIndex < 0 || contractIndex >= this.smartContracts.length) {
      console.error('Invalid contract index.');
      return null;
    }
    return new this.web3.eth.Contract(
      this.smartContracts[contractIndex].abi,
      this.smartContracts[contractIndex].address
    );
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled(): boolean {
    return typeof (window as any).ethereum !== 'undefined';
  }

  isAddressValid(address: string): boolean {
    if (!this.web3) {
      console.error('Web3 is not initialized.');
      return false;
    }
    if (!address) {
      return false;
    }
    return isAddressValidator(address);
  }

  // Connect to MetaMask
  async connectMetaMask(): Promise<Account | null> {
    this.loadingService.show();
    if (!this.isMetaMaskInstalled()) {
      alert('MetaMask is not installed. Please install it to proceed.');
      this.loadingService.hide();
      return null;
    }

    try {
      this.web3 = new Web3((window as any).ethereum);
      const accounts = await this.web3.eth.requestAccounts();
      this.accountObj.address = accounts[0];
      this.accountObj.networkId = await this.web3.eth.net.getId();
      const balanceInWei = await this.web3.eth.getBalance(this.accountObj.address);
      this.accountObj.balance = this.web3.utils.fromWei(balanceInWei, 'ether');
      return this.accountObj
    } catch (error: any) {
      alert('MetaMask connection error: ' + error.message);
      console.error('MetaMask connection error:', error);
      return null;
    } finally {
      this.loadingService.hide();
    }
  }

  // Monitor Account or Network Changes
  monitorChanges(onAccountChange: (account: string | undefined) => void): void {
    if (this.isMetaMaskInstalled()) {
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (this.accountObj) {
          this.accountObj.address = accounts.length > 0 ? accounts[0] : '';
        }
        onAccountChange(this.accountObj?.address);
      });

      (window as any).ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }

  isMetaMaskConnected(): boolean {
    return this.accountObj.address !== '';
  }

  // Get Connected Account
  getConnectedAccount(): Account | null {
    return this.accountObj;
  }
}
