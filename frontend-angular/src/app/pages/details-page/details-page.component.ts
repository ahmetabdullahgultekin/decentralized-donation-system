import {Component, OnInit} from '@angular/core';
import Web3 from 'web3';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Web3Service} from '../../services/web3.service';
import {Organization} from '../../interfaces/organization';
import {Account} from '../../interfaces/account';
import {FormsModule} from '@angular/forms';
import {LoadingService} from '../../services/loading.service';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.css'],
  imports: [
    NgForOf,
    NgIf,
    FormsModule
  ]
})
export class DetailsPageComponent implements OnInit {

  web3 = new Web3();
  userAccount: Account | null = null;
  isCommitPhase: boolean = false; // false = phase 1, true = phase 2
  isModalVisible: boolean = false;

  contract: any = null;

  name: string | null = null;
  organization: Organization | undefined;

  // Donations
  userDonations: any[] = [];
  // float
  donationAmount = 0;

  constructor(private route: ActivatedRoute, private web3Service: Web3Service, private loadingService: LoadingService) {
  }

  ngOnInit(): void {
    try {
      this.loadingService.show();
      this.initializeVars();
      this.updatePhase();
      setInterval(() => this.updatePhase(), 1000); // Update phase every second
    } catch (error) {
      console.error('Error initializing the page:', error);
      this.loadingService.hide();
    }
  }

  async checkRouteParams() {
    this.loadingService.show();
    this.name = this.route.snapshot.paramMap.get('id');

    if (this.name && !this.organization) {
      this.organization = await this.web3Service
        .getOrganizations()
        .then(
          (orgs) => orgs.find((org) => org.name === this.name)
        ).finally(() => {
          //this.loadingService.hide();
        });
    }
  }

  openConnectModal() {
    this.isModalVisible = true;
  }

  closeConnectModal() {
    this.isModalVisible = false;
  }

  async connectWallet() {
    try {
      await this.web3Service.connectMetaMask();
      this.userAccount = this.web3Service.getConnectedAccount();
      alert(`Wallet connected: ${this.userAccount?.address}`);
      this.closeConnectModal();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  }

  // Commit Donation Logic
  async commitDonation(orgAddress: string | undefined) {
    if (!this.userAccount?.address) {
      alert('Please connect your wallet first.');
      return;
    }

    if (!orgAddress) {
      alert('Organization address not found.');
      return;
    }

    if (!this.donationAmount || this.donationAmount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    const commitment = this.web3.utils.soliditySha3(
      {t: 'address', v: this.userAccount.address},
      {t: 'uint256', v: this.donationAmount},
    );


    this.contract.methods.commitDonation(orgAddress, commitment).send({
      from: this.userAccount.address,
      value: this.donationAmount,
    }).then((result: any) => {
      console.log('Commitment Result:', result);
    }).catch((error: any) => {
      console.error('Error committing donation:', error);
    });

    if (typeof commitment === 'string') {
      localStorage.setItem('commitment', commitment);
      localStorage.setItem('donationAmount', this.donationAmount.toString());

      alert('Donation committed! Remember to reveal in phase 2.');
      this.addToUserDonations(this.organization?.name, 'Awaiting Reveal');
    }
  }

  // Reveal Donation Logic
  async revealDonation(orgAddress: string | undefined) {
    if (!this.userAccount) {
      alert('Please connect your wallet first.');
      return;
    }

    const commitment = localStorage.getItem('commitment');
    const randomValue = localStorage.getItem('randomValue');
    const donationAmount = localStorage.getItem('donationAmount');

    if (!commitment || !randomValue || !donationAmount) {
      alert('No commitment found. Please commit a donation first.');
      return;
    }

    // Recompute the commitment hash for validation
    const recomputedHash = this.web3.utils.soliditySha3(
      {t: 'address', v: this.userAccount.address},
      {t: 'address', v: orgAddress},
      {t: 'uint256', v: donationAmount},
      {t: 'bytes32', v: randomValue}
    );

    if (recomputedHash === commitment) {
      alert('Donation successfully revealed!');
      this.updateDonationStatus(this.organization?.name, 'Revealed');
      // Add logic to interact with the smart contract for completing the reveal process
    } else {
      alert('Invalid reveal attempt. Hash mismatch.');
    }
  }

  updatePhase() {
    const phaseTime = 300; // 5 minutes per phase
    const currentTime = Math.floor(Date.now() / 1000);
    const timeInPhase = currentTime % (phaseTime * 2);
    this.isCommitPhase = timeInPhase >= phaseTime;
  }

  private initializeVars() {
    this.checkRouteParams().then(r => {
      console.log('Route params checked successfully. ', r);
    });
    this.contract = this.web3Service.createContractInstance(3);
    this.userAccount = this.web3Service.getConnectedAccount();
    this.isCommitPhase = false;
  }

  // Add a donation to the user's donation list
  private addToUserDonations(orgName: string | undefined, status: string) {
    if (orgName) {
      this.userDonations.push({
        orgName,
        status,
        timeRemaining: !this.isCommitPhase ? '00:00' : '5:00', // Placeholder for now
      });
    }
  }

  // Update the status of an existing donation
  private updateDonationStatus(orgName: string | undefined, newStatus: string) {
    const donation = this.userDonations.find((d) => d.orgName === orgName);
    if (donation) {
      donation.status = newStatus;
    }
  }
}
