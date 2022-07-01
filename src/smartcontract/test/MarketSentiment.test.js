const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MarketSentiment", () => {
  let marketContract;

  beforeAll(
    "Should return the new greeting once it's changed",
    async function () {
      const MarketSentiment = await ethers.getContractFactory(
        "MarketSentiment"
      );
      const marketSentiment = await MarketSentiment.deploy();
      marketContract = await marketSentiment.deployed();

      expect(marketContract).to.not.null();
    }
  );

  // it("Should ", () => {

  //   const setGreetingTx = await marketContract.

  //   // wait until the transaction is mined
  //   await setGreetingTx.wait();

  //   expect(await greeter.greet()).to.equal("Hola, mundo!");
  // });
});
