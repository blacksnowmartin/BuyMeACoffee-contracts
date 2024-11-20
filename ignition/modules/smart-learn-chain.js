// ... existing code ...

async function printPayments(payments) {
    for (const payment of payments) {
      const timestamp = payment.timestamp;
      const student = payment.registrationNumber;
      const studentAddress = payment.from;
      const details = payment.paymentDetails;
      const amount = hre.ethers.utils.formatEther(payment.amount);
      console.log(`At ${timestamp}, Student ${student} (${studentAddress}) paid ${amount} ETH for ${details}`);
    }
  }
  
  async function main() {
    // Get the example accounts
    const [institution, student1, student2, student3] = await hre.ethers.getSigners();
  
    // Deploy the contract
    const SmartLearnChain = await hre.ethers.getContractFactory("SmartLearnChain");
    const smartLearnChain = await SmartLearnChain.deploy();
    await smartLearnChain.deployed();
    console.log("SmartLearnChain deployed to:", smartLearnChain.address);
  
    // Check balances before payments
    const addresses = [institution.address, student1.address, smartLearnChain.address];
    console.log("== initial balances ==");
    await printBalances(addresses);
  
    // Make fee payments
    const fee = {value: hre.ethers.utils.parseEther("2")};  // 2 ETH as example fee
    await smartLearnChain.connect(student1).payFees("STU001", "Semester 1 2024", fee);
    await smartLearnChain.connect(student2).payFees("STU002", "Full Year 2024", fee);
    await smartLearnChain.connect(student3).payFees("STU003", "Semester 1 2024", fee);
  
    // Check balances after payments
    console.log("== after payments ==");
    await printBalances(addresses);
  
    // Withdraw fees
    await smartLearnChain.connect(institution).withdrawFees();
  
    // Check balances after withdrawal
    console.log("== after withdrawal ==");
    await printBalances(addresses);
  
    // Check payment records
    console.log("== payment records ==");
    const payments = await smartLearnChain.getPayments();
    printPayments(payments);
  }
  
  // ... existing error handling code ...