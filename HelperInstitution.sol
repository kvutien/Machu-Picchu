/* Contract (placeholder) to manage Machu Picchu helper institution
*/
contract HelperInstitution {
    address public personInNeed;
    address public owner;

    constructor (address _personInNeed) public {
        require(_personInNeed != 0x0);
        owner = msg.sender;
        personInNeed = _personInNeed;
    }
}

/* 
in migrations/2_deploy_contracts.js prepare argument to deploy the constructor
const HelperInstitution = artifacts.require('./HelperInstitution.sol')

module.exports = (deployer, network, accounts) => {
  const userAddress = accounts[3];
  deployer.deploy(HelperInstitution, userAddress)
}
*/