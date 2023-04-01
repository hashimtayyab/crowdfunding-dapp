const Crowdfund = artifacts.require("Crowdfund.sol");

module.exports = function (deployer) {
 deployer.deploy(Crowdfund, 100, 100000);
};