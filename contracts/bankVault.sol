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

    struct Request {
        address payable to;
        uint256 amount;
        uint8 approvals;
        bool executed;
    }

    uint256 private _nextRequestId = 1;
    mapping(uint256 => Request) public requests;
    mapping(uint256 => mapping(address => bool)) public approved;

    function requestWithdrawl(
        address payable who,
        uint256 amount
    ) external returns (uint256) {
        require(
            msg.sender == owner1 ||
                msg.sender == owner2 ||
                msg.sender == owner(),
            "only owners"
        );
        require(address(this).balance >= amount, "insufficeint balance");
        require(who == owner1 || who == owner2, "only owners an withdraw");

        uint256 id = _nextRequestId++;
        requests[id] = Request({
            to: who,
            amount: amount,
            approvals: 0,
            executed: false
        });
        return id;
    }

    function approve(uint256 requestId) external {
        require(
            msg.sender == owner1 ||
                msg.sender == owner2 ||
                msg.sender == owner(),
            "only owners"
        );
        Request storage r = requests[requestId];
        require(r.amount > 0, "request not found");
        require(!r.executed, "already executed");
        require(!approved[requestId][msg.sender], "already approved");

        approved[requestId][msg.sender] = true;
        r.approvals += 1;

        if (r.approvals >= 2) {
            r.executed = true;
            require(
                address(this).balance >= r.amount,
                "insufficient at execute"
            );
            (bool ok, ) = r.to.call{value: r.amount}("");
            require(ok, "transfer failed");
        }
    }

    function listRequests() external view returns (uint256[] memory) {
        uint256 cnt = _nextRequestId - 1;
        uint256[] memory ids = new uint256[](cnt);
        for (uint256 i = 0; i < cnt; i++) {
            ids[i] = i + 1;
        }
        return ids;
    }

    function getRequest(
        uint256 requestId
    )
        external
        view
        returns (
            address to,
            uint256 amount,
            uint8 approvals,
            bool executed,
            bool approvedByOwner1,
            bool approvedByOwner2
        )
    {
        Request storage r = requests[requestId];
        return (
            r.to,
            r.amount,
            r.approvals,
            r.executed,
            approved[requestId][owner1],
            approved[requestId][owner2]
        );
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
