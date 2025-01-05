import {Component, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {Web3Service} from '../../services/web3.service';
import Web3 from 'web3';
import {donationContractABI, donationContractAddress} from '../../jsons/donation.address.abi';
import {Account} from '../../interfaces/account';

@Component({
  selector: 'app-sign-in-page',
  imports: [
    NgIf
  ],
  templateUrl: './sign-in-page.component.html',
  styleUrl: './sign-in-page.component.css'
})
export class SignInPageComponent implements OnInit {
  web3: any;
  contract: any;
  userAccount: Account | null = null;

  donor: any = null;
  errorMessage: string | null = null;

  constructor(private web3Service: Web3Service) {
  }

  async ngOnInit() {
    this.userAccount = await this.web3Service.connectMetaMask();
    if (this.userAccount) {
      this.web3 = new Web3((window as any).ethereum);
      this.contract = new this.web3.eth.Contract(donationContractABI, donationContractAddress);
      await this.signIn();
    }
  }

  async signIn() {
    try {
      console.log('Connected Account:', await this.contract.methods.getDonor(this.web3Service.getConnectedAccount()).call(
        {from: donationContractAddress}
      ));
      const donorData = await this.contract.methods.getDonor(this.web3Service.getConnectedAccount()).call(
        {from: donationContractAddress}
      );
      this.donor = {
        id: donorData[0],
        name: donorData[1],
        wallet: donorData[2],
        level: this.getLevelName(donorData[3]),
        reputation: donorData[4],
      };
    } catch (error) {
      console.error('Error during sign in:', error);
      this.errorMessage = 'You are not registered as a donor. Please sign up first.';
    }
  }

  getLevelName(level: number): string {
    const levels = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Legend'];
    return levels[level] || 'Unknown';
  }
}
