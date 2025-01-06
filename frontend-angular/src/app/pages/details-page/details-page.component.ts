import {Component, OnInit} from '@angular/core';
import Web3 from 'web3';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Web3Service} from '../../services/web3.service';
import {Organization} from '../../interfaces/organization';
import {Account} from '../../interfaces/account';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css'],
  imports: [
    NgForOf,
    NgIf
  ]
})
export class DetailsPageComponent implements OnInit {

  web3 = new Web3();
  userAccount: Account | null = null;
  currentPhase: number = 1; // 1: Commit, 2: Reveal
  isModalVisible: boolean = false;

  name: string | null = null;

  organization: Organization | undefined;

  userDonations = [
    {orgName: 'Save The Ocean', status: 'Awaiting Reveal', timeRemaining: '12:30'},
  ];

  constructor(private route: ActivatedRoute, private web3Service: Web3Service) {

  }

  ngOnInit(): void {
    try {
      this.initializeVars();
      this.updatePhase();
      setInterval(() => this.updatePhase(), 1000); // Update phase every second
    } catch (error) {
      console.error('Error fetching organization:', error);
    }
  }

  private initializeVars() {
    this.checkRouteParams();
    this.userAccount = this.web3Service.getConnectedAccount();
  }

  checkRouteParams() {
    this.name = this.route.snapshot.paramMap.get('id');
    console.log('Organization name:', this.name);
    if (this.name) {
      this.organization = this.web3Service.getOrganizations().find(org => org.name === this.name);
    }
  }

  openConnectModal() {
    this.isModalVisible = true;
  }

  closeConnectModal() {
    this.isModalVisible = false;
  }

  async connectWallet() {
    await this.web3Service.connectMetaMask()
    // if (typeof (window as any).ethereum !== 'undefined') {
    //   this.web3 = new Web3((window as any).ethereum);
    //   try {
    //     const accounts = await (window as any).ethereum.request({
    //       method: 'eth_requestAccounts',
    //     });
    //     this.userAccount = accounts[0];
    //     alert(`Wallet connected: ${this.userAccount}`);
    //     this.closeConnectModal();
    //   } catch (error) {
    //     console.error('Wallet connection error:', error);
    //   }
    // } else {
    //   alert('MetaMask is not installed. Please install it to proceed.');
    // }
  }

  commitDonation(orgAddress: string | undefined) {
    if (!this.userAccount) {
      alert('Please connect your wallet first.');
      return;
    }

    if (!orgAddress) {
      alert('Organization address not found.');
      return;
    }

    const randomValue = this.web3.utils.randomHex(32);
    const commitment = this.web3.utils.soliditySha3(
      {t: 'address', v: this.userAccount},
      {t: 'address', v: orgAddress},
      {t: 'bytes32', v: randomValue}
    );

    if (typeof commitment === "string") {
      localStorage.setItem('commitment', commitment);
    }
    localStorage.setItem('randomValue', randomValue);

    alert('Donation committed! Remember to reveal in phase 2.');
  }

  revealDonation(orgAddress: string) {
    if (!this.userAccount) {
      alert('Please connect your wallet first.');
      return;
    }

    const commitment = localStorage.getItem('commitment');
    const randomValue = localStorage.getItem('randomValue');

    if (!commitment || !randomValue) {
      alert('No commitment found. Please commit a donation first.');
      return;
    }

    // Recompute the commitment hash for validation
    const recomputedHash = this.web3.utils.soliditySha3(
      {t: 'address', v: this.userAccount},
      {t: 'address', v: orgAddress},
      {t: 'bytes32', v: randomValue}
    );

    if (recomputedHash === commitment) {
      alert('Donation successfully revealed!');
      // Add logic for completing the reveal process (e.g., interacting with a smart contract)
    } else {
      alert('Invalid reveal attempt. Hash mismatch.');
    }
  }

  updatePhase() {
    const phaseTime = 300; // 5 minutes per phase
    const currentTime = Math.floor(Date.now() / 1000);
    const timeInPhase = currentTime % (phaseTime * 2);
    this.currentPhase = timeInPhase < phaseTime ? 1 : 2;
  }
}
