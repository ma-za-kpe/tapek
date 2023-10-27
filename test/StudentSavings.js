const { expect } = require("chai");

describe("StudentSavings", function () {
    let studentSavings;
    let owner;
    let student;

    beforeEach(async function () {
        [owner, student] = await ethers.getSigners();
        const StudentSavings = await ethers.getContractFactory("StudentSavings");
        studentSavings = await StudentSavings.deploy(10, 5, 3, 30); // Reward: 10, Course fee: 5, Withdraw limit: 3, Time limit: 30 seconds
        await studentSavings.deployed();
    });

    it("should allow a student to deposit", async function () {
        await studentSavings.connect(student).deposit({ value: 20 });
        const balance = await studentSavings.connect(student).getBalance();
        expect(balance).to.equal(20);
    });

    it("should allow a student to withdraw without enrolling in the course", async function () {
        await studentSavings.connect(student).deposit({ value: 30 });
        await studentSavings.connect(student).withdraw(10);
        const balance = await studentSavings.connect(student).getBalance();
        expect(balance).to.equal(20);
    });

    it("should enroll a student in the financial management course after the third withdrawal", async function () {
        await studentSavings.connect(student).deposit({ value: 50 });
        await studentSavings.connect(student).withdraw(10);
        await studentSavings.connect(student).withdraw(10);
        await studentSavings.connect(student).withdraw(10);
        const balance = await studentSavings.connect(student).getBalance();
        expect(balance).to.equal(15); // 50 - 10 - 10 - 10 - 5 (course fee)
    });

    it("should reward a student after the third withdrawal if not enrolling in the course", async function () {
        await studentSavings.connect(student).deposit({ value: 30 });
        await studentSavings.connect(student).withdraw(10);
        await studentSavings.connect(student).withdraw(10);
        await studentSavings.connect(student).withdraw(10);
        const balance = await studentSavings.connect(student).getBalance();
        expect(balance).to.equal(40); // 30 + 10 (reward) - 10 - 10 - 10
    });

    it("should prevent withdrawals after the limit is reached", async function () {
        await studentSavings.connect(student).deposit({ value: 30 });
        await studentSavings.connect(student).withdraw(10);
        await studentSavings.connect(student).withdraw(10);
        await studentSavings.connect(student).withdraw(10);
        // Attempt to withdraw again, which should fail
        await expect(studentSavings.connect(student).withdraw(10)).to.be.revertedWith("Withdraw limit exceeded");
    });

    it("should prevent withdrawals before the time limit is reached", async function () {
        await studentSavings.connect(student).deposit({ value: 30 });
        await studentSavings.connect(student).withdraw(10);
        // Attempt to withdraw again before the time limit is reached, which should fail
        await expect(studentSavings.connect(student).withdraw(10)).to.be.revertedWith("Time limit not reached");
    });
});
