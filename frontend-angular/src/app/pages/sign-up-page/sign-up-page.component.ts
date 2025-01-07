import {Component} from '@angular/core';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Web3Service} from '../../services/web3.service';
import Web3 from 'web3';
import {Account} from '../../interfaces/account';

@Component({
  selector: 'app-sign-up-page',
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.css'
})
export class SignUpPageComponent {
  web3: any;
  contract: any;
  userAccount: Account | null = null;

  donorName: string = '';
  donorAddress: string | null = null; // 0: Bronze, 1: Silver, etc.
  errorMessage: string | null = null;

  constructor(private web3Service: Web3Service) {
  }

  async ngOnInit() {
    this.userAccount = await this.web3Service.connectMetaMask();
    if (this.userAccount) {
      this.web3 = new Web3((window as any).ethereum);
      this.contract = this.web3Service.createContractInstance(3)
    }
  }

  async signUp() {
    if (!this.donorName || this.donorAddress === null) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    try {
      await this.contract.methods.signUp(this.donorName, this.donorAddress).send({
        from: this.userAccount?.address,
      });
      alert('Sign up successful! Welcome to DonateChain!');
    } catch (error) {
      console.error('Error during sign up:', error);
      this.errorMessage = 'Failed to sign up. Please try again.';
    }
  }
}
