// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StudentSavings {
    address public owner;
    uint256 public reward;
    uint256 public courseFee;
    uint256 public withdrawLimit;
    uint256 public timeLimit;
    uint256 public lastWithdrawTime;
    uint256 public withdrawCount;

    mapping(address => uint256) public savings;

    event Deposit(address indexed student, uint256 amount);
    event Withdraw(address indexed student, uint256 amount);
    event EnrollInCourse(address indexed student);

    constructor(uint256 _reward, uint256 _courseFee, uint256 _withdrawLimit, uint256 _timeLimit) {
        owner = msg.sender;
        reward = _reward;
        courseFee = _courseFee;
        withdrawLimit = _withdrawLimit;
        timeLimit = _timeLimit;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        savings[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public {
        require(savings[msg.sender] >= amount, "Insufficient balance");
        require(withdrawCount <= withdrawLimit, "Withdraw limit exceeded");
        require(block.timestamp - lastWithdrawTime >= timeLimit, "Time limit not reached");

        savings[msg.sender] -= amount;
        withdrawCount++;
        lastWithdrawTime = block.timestamp;
        emit Withdraw(msg.sender, amount);

        if (withdrawCount > withdrawLimit) {
            emit EnrollInCourse(msg.sender);
            savings[msg.sender] -= courseFee;
        }

        if (withdrawCount <= withdrawLimit) {
            if (withdrawCount == withdrawLimit) {
                // Student qualifies for the reward.
                savings[msg.sender] += reward;
            }
        }
    }

    function getBalance() public view returns (uint256) {
        return savings[msg.sender];
    }
}
