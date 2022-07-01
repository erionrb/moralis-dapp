const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const MarketSentinment = await hre.ethers.getContractFactory(
    "MarketSentinment"
  );
  const marketSentinment = await MarketSentinment.deploy();

  await marketSentinment.deployed();

  console.log("MarketSentinment deployed to:", marketSentinment.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
