// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "hardhat/console.sol";

contract Tapek {

    address public owner;
    uint256 public totalBalance;


    constructor(){
        owner = msg.sender;
    }

    struct StudentData {
        address user;
        string name;
        string email;
        string ghanaId;
        uint balance;
        uint expenses;
        bool rewards;
    }

    struct Deposit {
        uint256 amount;
        string reason;
    }

    mapping(address => StudentData) public studentData;
    mapping(address => Deposit[]) public deposits;

    event StudentRegistered(address indexed user, string ghanaId);
    event DepositReceived(address indexed user, uint256 amount, string reason);



     // Function for user to register their new data
    function registerStudent(
            string memory ghanaId, 
            string memory name, 
            uint  balance, 
            uint expenses, 
            bool rewards,
            string memory email
        ) public {
        require(bytes(studentData[msg.sender].ghanaId).length == 0, "Data already registered");
        studentData[msg.sender] = StudentData(msg.sender, name, email, ghanaId, balance, expenses, rewards);
        emit StudentRegistered(msg.sender, ghanaId);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function deposit(string memory reason) public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");

        uint256 amount = msg.value;
        totalBalance += amount;

        Deposit memory depositData = Deposit({
            amount: amount,
            reason: reason
        });

        deposits[msg.sender].push(depositData);

        emit DepositReceived(msg.sender, amount, reason);
    }

    function getDepositCount(address user) public view returns (uint256) {
        return deposits[user].length;
    }

    function getDeposit(address user, uint256 index) public view returns (uint256, string memory) {
        require(index < deposits[user].length, "Index out of range");
        Deposit memory getDepositt = deposits[user][index];
        return (getDepositt.amount, getDepositt.reason);
    }

    function withdraw(uint256 amount) public onlyOwner {
        require(amount <= address(this).balance, "Not enough balance in the contract");
        payable(owner).transfer(amount);
        totalBalance -= amount;
    }
          // not altering state, 
  function getOwner() public view returns(address) {
    return owner;
  }
}