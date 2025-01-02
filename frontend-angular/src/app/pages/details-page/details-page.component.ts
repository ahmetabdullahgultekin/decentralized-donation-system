import {Component} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import Web3 from 'web3';

@Component({
  selector: 'app-details-page',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.css'
})
export class DetailsPageComponent {
  web3: any;
  userAccount: string | null = null;
  currentPhase = 1;

  organizations = [
    {name: 'Save The Ocean', level: 'Silver', reputation: 780, address: '0x123...'},
    {name: 'Green Earth Fund', level: 'Gold', reputation: 920, address: '0x456...'}
  ];

  userDonations = [
    {orgName: 'Save The Ocean', status: 'Awaiting Reveal', timeRemaining: '12:30'}
  ];

  constructor() {
  }

  ngOnInit(): void {
    this.updatePhase();
    setInterval(() => this.updatePhase(), 1000); // Update phase every second
  }

  async connectWallet() {
    if (typeof (window as any).ethereum !== 'undefined') {
      this.web3 = new Web3((window as any).ethereum);
      try {
        const accounts = await (window as any).ethereum.request({method: 'eth_requestAccounts'});
        this.userAccount = accounts[0];
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('MetaMask is not installed.');
    }
  }

  commitDonation(orgAddress: string) {
    if (!this.userAccount) {
      alert('Please connect your wallet first.');
      return;
    }

    const randomValue = this.web3.utils.randomHex(32);
    const commitment = this.web3.utils.soliditySha3(
      {t: 'address', v: this.userAccount},
      {t: 'address', v: orgAddress},
      {t: 'bytes32', v: randomValue}
    );

    localStorage.setItem('commitment', commitment);
    localStorage.setItem('randomValue', randomValue);

    alert('Donation committed! Remember to reveal in phase 2.');
  }

  updatePhase() {
    const phaseTime = 300; // 5 minutes per phase
    const currentTime = Math.floor(Date.now() / 1000);
    const timeInPhase = currentTime % (phaseTime * 2);
    this.currentPhase = timeInPhase < phaseTime ? 1 : 2;
  }
}
