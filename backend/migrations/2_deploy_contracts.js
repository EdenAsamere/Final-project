// migrations/2_deploy_contracts.js
const Equb = artifacts.require("EqubGroup");
const EqubContribution = artifacts.require("EqubContribution");

module.exports = async function (deployer) {
    await deployer.deploy(Equb);
    await deployer.deploy(EqubContribution);
};