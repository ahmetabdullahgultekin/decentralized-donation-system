import {Injectable} from '@angular/core';
import Web3 from 'web3';
import {Account} from '../interfaces/account';
import {LoadingService} from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class MetaMaskService {
  private web3: Web3 | null = null;
  private contract: any;
  private accountObj: Account = {
    address: '',
    networkId: BigInt(0),
    balance: '',
  }

  constructor(private loadingService: LoadingService) {
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled(): boolean {
    return typeof (window as any).ethereum !== 'undefined';
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
    } catch (error : any) {
      alert('MetaMask connection error: ' + error.message);
      console.error('MetaMask connection error:', error);
      return null;
    } finally {
      this.loadingService.hide();
    }
  }

  // Get Connected Account
  getConnectedAccount(): Account | null {
    return this.accountObj;
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
    this.contract = new this.web3.eth.Contract(contractAbi, contractAddress);
    return this.contract;
  }
}
