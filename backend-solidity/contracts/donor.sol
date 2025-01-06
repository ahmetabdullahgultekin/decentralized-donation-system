// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract DonationSystem is ERC721 {
    address internal admin; // Deployer

    struct Organization {
        uint256 id;
        string name;
        address wallet;
        uint8 level;
    }

    struct Donation {
        uint256 id;
        uint256 amount;
        bytes32 hash;
        bool revealed;
        uint256 revealDueDate;
        address organization;
    }

    struct Donor {
        uint256 id;
        string name;
        address wallet;
        uint8 level; // 0: Bronze, 1: Silver, 2: Gold, etc.
        uint256 reputation;
        uint256 penalties;
        uint256 donationCount; // Total number of donations
    }

    Organization[] public organizations; // Beneficiaries
    Donor[] private donorList; // List of donors (for iteration if needed)
    mapping(address => Donation[]) public donations; //
    mapping(address => Organization) private organizationDetails; // Organization details mapped by wallet
    mapping(address => Donor) public donors; // Donor details mapped by wallet
    mapping(address => bool) internal isRegistered; // Check if a donor is already registered

    uint256 public tokenIdCounter;

    // Events
    event DonationReceived(address indexed donor, uint256 donationId, bytes32 hash);
    event DonationRevealed(address indexed donor, uint256 donationId, uint256 amount);
    event PenaltyApplied(address indexed donor, uint256 penaltyTime);
    event BadgeAssigned(address indexed donor, uint8 level);
     event OrganizationAdded(uint256 id, string name, address wallet);

    constructor() ERC721("ReputationBadge", "RBD") {
        admin = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == admin, "Only the owner can perform this action");
        _;
    }

    modifier onlyRegistered() {
        require(isRegistered[msg.sender], "Donor not registered");
        _;
    }

    function signUp(string memory _name, address sender) external {
        require(!isRegistered[msg.sender], "Donor already registered");
       // require(_level <= 4, "Invalid level"); // 0: Bronze, 4: Diamond

        donors[sender] = Donor({
            id: donorList.length,
            name: _name,
            wallet: sender,
            level: 0,
            reputation: 0,
            penalties: 0,
            donationCount: 0
        });

        donorList.push(donors[sender]);
        isRegistered[sender] = true;
    }

    function addOrganization(string memory _name, address _wallet, uint8 _level) external onlyOwner {
        require( organizationDetails[_wallet].wallet != _wallet , "Organization already registered");

        organizations.push(Organization({
            id: organizations.length,
            name: _name,
            wallet: _wallet,
            level: _level
        }));

        organizationDetails[_wallet] = organizations[organizations.length - 1];
       

        emit OrganizationAdded(organizations.length - 1, _name, _wallet);
    }

    function donate(bytes32 hash, address organization) external onlyRegistered {
        uint256 donationId = donations[msg.sender].length;

        donations[msg.sender].push(Donation({
            id: donationId,
            amount: 0,
            hash: hash,
            revealed: false,
            revealDueDate: block.timestamp + 10 days,
            organization: organization
        }));

        emit DonationReceived(msg.sender, donationId, hash);
    }

    function revealDonation(uint256 donationId, uint256 amount) external payable  onlyRegistered {
        Donor storage donor = donors[msg.sender];
        require(donationId < donations[msg.sender].length, "Invalid donation ID");
        require(msg.value > 0 , "Donations must be greater than zero.");

        Donation storage donation = donations[msg.sender][donationId];
        require(!donation.revealed, "Donation already revealed");
        require(donation.revealDueDate >= block.timestamp, "Reveal time expired");
        require(keccak256(abi.encodePacked(amount, msg.sender)) == donation.hash, "Invalid hash");

        donation.amount = amount;
        donation.revealed = true;
        donor.donationCount++;

        _updateBadgeLevel(donor);

        address org = donation.organization;

        payable(org).transfer(msg.value);

        emit DonationRevealed(msg.sender, donationId, amount);
    }

    function applyPenalty(address donorAddr, uint256 donationId) external onlyOwner {
        Donor storage donor = donors[donorAddr];
        require(donationId < donations[donorAddr].length, "Invalid donation ID");

        Donation storage donation = donations[donorAddr][donationId];
        require(!donation.revealed, "Donation already revealed");
        require(donation.revealDueDate < block.timestamp, "Reveal period not yet ended");

        donor.penalties++;
        if (donor.penalties % 2 == 0 && donor.level > 0) {
            _assignBadge(donor, donor.level - 1);
            donor.donationCount -=10;
        }

        emit PenaltyApplied(donorAddr, block.timestamp);
    }

    function _updateBadgeLevel(Donor storage donor) internal {
        uint8 newLevel;
        if (donor.donationCount >= 25) {
            newLevel = 3; // Diamond
        } else if (donor.donationCount >= 15) {
            newLevel = 2; // Gold
        } else if (donor.donationCount >= 5) {
            newLevel = 1; // Silver
        } else {
            newLevel = 0; // Bronze
        }

        _assignBadge(donor, newLevel);
    }

    function _assignBadge(Donor storage donor, uint8 level) internal {
        require(level <= 3, "Invalid badge level");
        donor.level = level;
        uint256 tokenId = tokenIdCounter; // Benzersiz bir token ID'si
        tokenIdCounter++;
        _mint(donor.wallet, tokenId);

        emit BadgeAssigned(donor.wallet, level);
    }

      // Get Donor Details by Wallet Address
    function getDonor(address _wallet)
        public
        view
        returns (uint256, string memory, address, uint8, uint256)
    {
        require(isRegistered[_wallet], "Donor not registered");
        Donor memory donor = donors[_wallet];
        return (donor.id, donor.name, donor.wallet, donor.level, donor.reputation);
    }
}
