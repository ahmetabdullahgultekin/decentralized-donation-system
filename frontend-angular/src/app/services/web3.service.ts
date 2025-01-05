import {Injectable} from '@angular/core';
import Web3 from 'web3';
import {isAddress as isAddressValidator} from 'web3-validator';
import {Account} from '../interfaces/account';
import {LoadingService} from './loading.service';
import {donationContractAbi, donationContractAddress} from '../json/abi.json';

@Injectable({
  providedIn: 'root',
})
export class Web3Service {

  private web3: Web3 | null = null;
  private contract: any = null;
  private contractAddress: string = donationContractAddress;
  private contractAbi = donationContractAbi;
  private accountObj: Account = {
    address: '',
    networkId: BigInt(0),
    balance: '',
  }

  constructor(private loadingService: LoadingService) {

  }

  initializeService() {
    try {
      this.web3 = new Web3((window as any).ethereum);
      if (!this.web3) {
        alert('Web3 is not initialized.');
        console.error('Web3 is not initialized.');
        return null;
      }
      if (!this.contractAbi) {
        alert('Donation Contract ABI is not provided.');
      }
      if (!this.isAddressValid(donationContractAddress)) {
        alert('Invalid Donation Contract Address.');
      }
      this.contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress);
      return this.contract;
    } catch (e) {
      alert('Web3 service could not initialized! ' + e);
      console.error('Web3 service could not initialized! ', e);
    }
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

  // Get Contract
  getContract(): any {
    return this.contract;
  }

  // Get Contract Address
  getContractAddress(): string {
    return this.contractAddress;
  }

  // Get Contract ABI
  getContractAbi(): any {
    return this.contractAbi;
  }

  // Set Contract Address
  setContractAddress(address: string): void {
    if (!this.isAddressValid(address)) {
      alert('Invalid Contract Address.');
      return;
    }
    this.contractAddress = address;
  }

  // Set Contract ABI
  setContractAbi(abi: any): void {
    if (!abi) {
      alert('Invalid Contract ABI.');
      return;
    }
    this.contractAbi = abi;
  }

  setABIandAddress(abi: any, address: string): void {
    this.setContractAbi(abi);
    this.setContractAddress(address);
    this.initializeService();
  }
}
