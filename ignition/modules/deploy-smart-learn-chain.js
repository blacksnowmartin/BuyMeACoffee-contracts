const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const SmartLearnChain = await hre.ethers.getContractFactory("SmartLearnChain");
  
  // Deploy the contract
  const smartLearnChain = await SmartLearnChain.deploy();
  
  // Wait for deployment to finish
  await smartLearnChain.deployed();
  
  // Print the address where the contract was deployed to
  console.log("SmartLearnChain deployed to:", smartLearnChain.address);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 