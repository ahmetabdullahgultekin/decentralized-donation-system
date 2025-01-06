// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract OrganizationManager {
    address public admin;

    struct Organization {
        uint256 id;
        string name;
        address wallet;
        bool approved;
        uint256 like;
        uint8 level; // 0: Silver, 1: Gold, 2: Premium ...
    }

    Organization[] public organizations; // Array to store organizations
        
    mapping(address => bool) public isOrganization; // Check if an address is an organization
    mapping(address => bool) public isApprovedOrganization;

    event OrganizationRequested(string name, address organizationAddress);
    event OrganizationApproved(string name, address organizationAddress);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    constructor() {
        admin = msg.sender;
    }
    // Add a new organization
    function addOrganization(
        string memory _name,
        address _wallet
    ) public {
        require(!isOrganization[_wallet], "Organization already exists");
        uint256 id = organizations.length;
        organizations.push(Organization(id, _name, _wallet, false,0, 0));
        isOrganization[_wallet] = true;
    }

    // Get the total number of organizations
    function getOrganizationCount() public view returns (uint256) {
        return organizations.length;
    }

    // Fetch an organization by index
    function getOrganization(uint256 index)
        public
        view
        returns (
            uint256 id,
            string memory name,
            address wallet,
            uint256 reputation,
            uint8 level
        )
    {
        Organization memory org = organizations[index];
        return (org.id, org.name, org.wallet, org.like, org.level);
    }

     // Approve an organization
    function approveOrganization(uint256 index) external onlyAdmin {
        require(index < organizations.length, "Invalid index");
        Organization storage org = organizations[index];
        require(!org.approved, "Organization already approved");

        org.approved = true;
        isApprovedOrganization[org.wallet] = true;

        emit OrganizationApproved(org.name, org.wallet);
    }
    function getOrganizationLevel(address organizationAddress) external view returns (uint256) {
        for (uint256 i = 0; i < organizations.length; i++) {
            if (organizations[i].wallet == organizationAddress) {
                return organizations[i].level;
            }
        }
        revert("Organization not found");
    }

    /* Like an organization
    function likeOrganization(uint256 index) external {
        require(index < organizations.length, "Invalid index");
        Organization storage org = organizations[index];
        require(!org.likedBy[msg.sender], "You have already liked this organization");

        org.likes += 1;
        org.likedBy[msg.sender] = true;

        emit OrganizationLiked(org.name, msg.sender);
    }*/
}

contract DonationSystem is ERC721 {
    address public admin; // Deployer
    OrganizationManager public organizationManager;

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

    mapping(address => Donation[]) public donations; //
    mapping(address => Donor) public donors; // Donor details mapped by wallet
    mapping(address => uint256) public donorIds;  // Map wallet address
    mapping(address => bool) internal isRegistered; // Check if a donor is already registered

    uint256 public tokenIdCounter;
    uint8 private donorCounter = 1;

    // Events
    event DonationReceived(address indexed donor, uint256 donationId, bytes32 hash);
    event DonationRevealed(address indexed donor, uint256 donationId, uint256 amount);
    event PenaltyApplied(address indexed donor, uint256 penaltyTime);
    event BadgeAssigned(address indexed donor, uint8 level);
     event OrganizationAdded(uint256 id, string name, address wallet);

    

    modifier onlyOwner() {
        require(msg.sender == admin, "Only the owner can perform this action");
        _;
    }

    modifier onlyRegistered() {
        require(isRegistered[msg.sender], "Donor not registered");
        _;
    }

    modifier onlyApprovedOrganization(address organization) {
        require(
            organizationManager.isApprovedOrganization(organization),
            "Organization not approved"
        );
        _;
    }

    modifier onlyEligibleDonor(address organization, address _donor) {
        Donor storage donor = donors[_donor];
        uint256 donorLevel = donor.level;
        uint256 organizationLevel = organizationManager.getOrganizationLevel(organization);
        require(donorLevel >= organizationLevel, "Donor level is not sufficient for this organization");
        _;
    }

    constructor() ERC721("ReputationBadge", "RBD") {
        admin = payable(msg.sender);
        organizationManager = OrganizationManager(0xE7748421d44CB1369dfe2beeE41D12A5103B8d15);
    }

    function signUp(string memory _name, address sender) external {
        require(!isRegistered[msg.sender], "Donor already registered");
       // require(_level <= 4, "Invalid level"); // 0: Bronze, 4: Diamond

        donors[sender] = Donor({
            id: donorCounter,
            name: _name,
            wallet: sender,
            level: 0,
            reputation: 0,
            penalties: 0,
            donationCount: 0
        });

        donorCounter++;

        isRegistered[sender] = true;
        donorIds[msg.sender]= donorCounter;
    }

    function donate(bytes32 hash, address organization) external onlyRegistered onlyApprovedOrganization(organization) onlyEligibleDonor( organization, msg.sender){
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
        //require(msg.value == amount, "Amount mismatch with sent Ether.");
        Donation storage donation = donations[msg.sender][donationId];
        require(!donation.revealed, "Donation already revealed");
        require(donation.revealDueDate >= block.timestamp, "Reveal time expired");
        require(keccak256(abi.encodePacked(amount, msg.sender)) == donation.hash, "Invalid hash");

        donation.amount = amount;
        donation.revealed = true;
        donor.donationCount++;

        if (donor.donationCount >= 25) {
            _assignBadge(donor, 3); // Diamond
        } else if (donor.donationCount >= 15) {
            _assignBadge(donor, 2); // Gold
        } else if (donor.donationCount >= 5) {
            _assignBadge(donor, 1); // Silver
        } else {
            _assignBadge(donor, 0); // Bronze
        }


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


    function _assignBadge(Donor storage donor, uint8 level) internal {
        require(level <= 3, "Invalid badge level");
        donor.level = level;
        _mint(donor.wallet, tokenIdCounter);
        tokenIdCounter++;
        

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
    function getDonorCount() external view returns(uint256){
        return donorCounter;
     }
   
}