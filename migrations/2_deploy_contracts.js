const Equb = artifacts.require("EqubGroup");

module.exports = async function (deployer) {
    await deployer.deploy(Equb);
};
