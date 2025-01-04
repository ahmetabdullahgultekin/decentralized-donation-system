import {Injectable} from '@angular/core';
import Web3 from 'web3';
import {Account} from '../interfaces/account';

@Injectable({
  providedIn: 'root',
})
export class MetaMaskService {
  private web3: Web3 | null = null;
  private accountObj: Account = {
    address: '',
    networkId: BigInt(0),
    balance: '',
  }

  constructor() {
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled(): boolean {
    return typeof (window as any).ethereum !== 'undefined';
  }

  // Connect to MetaMask
  async connectMetaMask(): Promise<Account | null> {
    if (!this.isMetaMaskInstalled()) {
      alert('MetaMask is not installed. Please install it to proceed.');
      return null;
    }

    try {
      this.web3 = new Web3((window as any).ethereum);
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });
      this.accountObj.address = accounts[0];
      this.accountObj.networkId = await this.web3.eth.net.getId();
      const balanceInWei = await this.web3.eth.getBalance(this.accountObj.address);
      this.accountObj.balance = this.web3.utils.fromWei(balanceInWei, 'ether');
      return this.accountObj
    } catch (error) {
      console.error('MetaMask connection error:', error);
      return null;
    }
  }

  // Get Connected Account
  getConnectedAccount(): Account | null {
    return this.accountObj;
  }

  // Get Current Network ID
  async getNetworkId(): Promise<bigint | null> {
    if (!this.web3) {
      return null;
    }
    try {
      if (this.accountObj) {
        this.accountObj.networkId = await this.web3.eth.net.getId();
        return this.accountObj?.networkId;
      }
      return null;
    } catch (error) {
      console.error('Error fetching network ID:', error);
      return null;
    }
  }

  // Get Account Balance
  async getBalance(): Promise<string | null> {
    if (!this.web3 || !this.accountObj) {
      return null;
    }
    try {
      const balanceInWei = await this.web3.eth.getBalance(this.accountObj.address);
      this.accountObj.balance = this.web3.utils.fromWei(balanceInWei, 'ether');
      return this.accountObj.balance;
    } catch (error) {
      console.error('Error fetching account balance:', error);
      return null;
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

  initializeContract(contractAbi: any, contractAddress: string) {
    if (!this.web3) {
      console.error('Web3 is not initialized.');
      return null;
    }
    return new this.web3.eth.Contract(contractAbi, contractAddress);
  }
}
