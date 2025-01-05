// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//0x17619eA794732aDd79D115994a09D6898eE8226A

contract OrganizationManager {
    struct Organization {
        uint256 id;
        string name;
        address wallet;
        uint256 reputation;
        uint8 level; // 0: Silver, 1: Gold, 2: Premium
    }

    Organization[] public organizations; // Array to store organizations
    mapping(address => bool) public isOrganization; // Check if an address is an organization

    // Add a new organization
    function addOrganization(
        string memory _name,
        address _wallet,
        uint8 _level
    ) public {
        require(!isOrganization[_wallet], "Organization already exists");
        uint256 id = organizations.length;
        organizations.push(Organization(id, _name, _wallet, 0, _level));
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
        return (org.id, org.name, org.wallet, org.reputation, org.level);
    }
}
