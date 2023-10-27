const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { etherss } = require("ethers");

describe("Tapek", function() {

    const studentData = {
        name: "Maku popo", 
        email: "makpalyy@gmail.com",
        ghanaId:"grizz777leywhiskers",
        balance: 30000, 
        expenses: 500000,
        rewards: false
      };

    async function deployContractFixture() {
        const[owner, account2] = await ethers.getSigners();
        const Tapek = await ethers.getContractFactory("Tapek");
        const contract = await Tapek.deploy();
        // await contract.connect(account2)
        return {owner,contract};
      }

      describe("Deployment", function() {
        it("Should set the right owner", async function() {
          const { owner, contract } = await loadFixture(deployContractFixture);
          const contractOwner = await contract.owner();
          expect(contractOwner).to.equal(owner.address);
        });
    
        it("Should return the right owner", async function() {
          const { owner, contract } = await loadFixture(deployContractFixture);
          const contractOwner = await contract.getOwner();
          expect(contractOwner).to.equal(owner.address);
        });
      });

      it("should allow a user to register student data", async function () {
        const { owner, contract } = await loadFixture(deployContractFixture);
        const ghanaId = "123456";
        const name = "John Doe";
        const balance = 1000;
        const expenses = 500;
        const rewards = true;
        const email = "johndoe@example.com";
    
        await contract.connect(owner).registerStudent(ghanaId, name, balance, expenses, rewards, email);
    
        // Verify the registration was successful
        const studentData = await contract.studentData(owner.address);
    
        expect(studentData.ghanaId).to.equal(ghanaId);
      });
    
      it("should not allow a user to re-register student data", async function () {
        const { owner, contract } = await loadFixture(deployContractFixture);
        const ghanaId = "123456";
        const name = "John Doe";
        const balance = 1000;
        const expenses = 500;
        const rewards = true;
        const email = "johndoe@example.com";
    
        // Attempt to register the same data again
        try {
          await contract.connect(owner).registerStudent(ghanaId, name, balance, expenses, rewards, email);
          // If registration succeeds, this test case should fail
          expect.fail("Registration succeeded when it should not have.");
        } catch (error) {
          // Registration should fail, and we expect it to throw an error
          expect(error.message).to.include("Data already registered");
        }
      });

      describe("Deposit", function () {

        // it("should allow users to make deposits and emit events", async function () {
        //     const { owner, depositContract } = await loadFixture(deployContractFixture);
        //     const depositAmount = ethers.utils.parseEther("1.0");
        //     const depositReason = "Savings";

        //     await depositContract.connect(user1).deposit(depositReason, {
        //     value: depositAmount,
        //     });

        //     const user1DepositCount = await depositContract.getDepositCount(user1.address);
        //     expect(user1DepositCount).to.equal(1);

        //     const [user1DepositAmount, user1DepositReason] = await depositContract.getDeposit(
        //     user1.address,
        //     0
        //     );
        //     expect(user1DepositAmount).to.equal(depositAmount);
        //     expect(user1DepositReason).to.equal(depositReason);

        //     // Ensure the event was emitted
        //     const depositEvent = await depositContract.queryFilter("DepositReceived");
        //     expect(depositEvent.length).to.equal(1);
        //     expect(depositEvent[0].args.user).to.equal(user1.address);
        //     expect(depositEvent[0].args.amount).to.equal(depositAmount);
        //     expect(depositEvent[0].args.reason).to.equal(depositReason);
        // });

        // it("should prevent deposit of zero or negative amounts", async function () {
        //     const { owner, depositContract } = await loadFixture(deployContractFixture);

        //     // Attempt to deposit 0 Ether
        //     await expect(
        //     depositContract.connect(user2).deposit("Zero Deposit", {
        //         value: ethers.utils.parseEther("0.0"),
        //     })
        //     ).to.be.revertedWith("Deposit amount must be greater than 0");

        //     // Attempt to deposit a negative amount
        //     await expect(
        //     depositContract.connect(user2).deposit("Negative Deposit", {
        //         value: ethers.utils.parseEther("-1.0"),
        //     })
        //     ).to.be.revertedWith("Deposit amount must be greater than 0");
        // });

        // it("should allow the owner to withdraw funds", async function () {
        //     const { owner, depositContract } = await loadFixture(deployContractFixture);

        //     const initialBalance = await ethers.provider.getBalance(owner.address);
        //     const withdrawalAmount = etherss.utils.parseEther("0.5");

        //     await depositContract.withdraw(withdrawalAmount);

        //     const finalBalance = await ethers.provider.getBalance(owner.address);
        //     const expectedBalance = initialBalance.add(withdrawalAmount);

        //     expect(finalBalance).to.equal(expectedBalance);
        // });

        // it("should prevent non-owners from withdrawing funds", async function () {
        //     const { owner, depositContract } = await loadFixture(deployContractFixture);
        //     await expect(depositContract.connect(user1).withdraw(ethers.utils.parseEther("0.1"))).to.be.revertedWith("Only the owner can call this function");
        // });
    });

});  