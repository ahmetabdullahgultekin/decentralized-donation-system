// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//0x9ecEA68DE55F316B702f27eE389D10C2EE0dde84

contract DonorManager {
    struct Donor {
        uint256 id;
        string name;
        address wallet;
        uint8 level; // 0: Bronze, 1: Silver, 2: Gold, etc.
        uint256 reputation;
    }

    Donor[] public donors;
    mapping(address => bool) public isRegistered; // Check if a donor is already registered
    mapping(address => uint256) public donorIds;  // Map wallet address to donor ID

    // Register a new donor (Sign Up)
    function signUp(string memory _name, uint8 _level) public {
        require(!isRegistered[msg.sender], "Donor already registered");
        require(_level <= 4, "Invalid level"); // 0: Bronze, 4: Diamond

        uint256 id = donors.length;
        donors.push(Donor(id, _name, msg.sender, _level, 0)); // Initial reputation = 0
        isRegistered[msg.sender] = true;
        donorIds[msg.sender] = id;
    }

    // Get donor details by wallet address (Sign In)
    function getDonor(address _wallet)
        public
        view
        returns (uint256, string memory, address, uint8, uint256)
    {
        require(isRegistered[_wallet], "Donor not registered");
        uint256 id = donorIds[_wallet];
        Donor memory donor = donors[id];
        return (donor.id, donor.name, donor.wallet, donor.level, donor.reputation);
    }
}
