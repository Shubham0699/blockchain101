//SPDX-LICENSE-IDENTIFIER:UNLICENSED;

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract bankVault is Ownable {
    address immutable owner1;
    address immutable owner2;

    constructor(
        address owner1_,
        address owner2_,
        address initialOwner
    ) Ownable(initialOwner) {
        owner1 = owner1_;
        owner2 = owner2_;
    }

    function deposite() public payable {}

    function requestWithdrawl(
        address who,
        uint256 amount
    ) external payable onlyOwner returns (uint256) {}

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
