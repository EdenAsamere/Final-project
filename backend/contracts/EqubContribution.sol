// contracts/EqubContribution.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EqubContribution {
    struct Contribution {
        address contributor;
        uint256 amount;
        uint256 timestamp;
        string equbId;
        string userId;
        string txRef;
    }

    // Make mappings public for better visibility
    mapping(string => Contribution) public contributions;
    mapping(string => string[]) public equbContributions;
    
    // Add counter for total contributions
    uint256 public totalContributions;
    
    // Enhanced event with indexed parameters for better filtering
    event ContributionLogged(
        string indexed equbId,  // Note: string cannot be indexed in Solidity, but we'll keep the indexed keyword
        address indexed contributor,
        uint256 amount,
        uint256 timestamp,
        string userId,
        string txRef
    );

    // Add event for easier tracking
    event ContributionAdded(
        string txRef,
        string equbId,
        uint256 amount,
        uint256 timestamp
    );

    function logContribution(
        string memory equbId,
        string memory userId,
        uint256 amount,
        uint256 timestamp,
        string memory txRef
    ) public {
        require(amount > 0, "Amount must be greater than 0");
        require(bytes(equbId).length > 0, "EqubId cannot be empty");
        require(bytes(userId).length > 0, "UserId cannot be empty");
        require(bytes(txRef).length > 0, "TxRef cannot be empty");

        contributions[txRef] = Contribution(
            msg.sender,
            amount,
            timestamp,
            equbId,
            userId,
            txRef
        );

        // Add txRef to equbContributions
        equbContributions[equbId].push(txRef);
        
        // Increment total contributions
        totalContributions++;

        // Emit both events
        emit ContributionLogged(
            equbId,
            msg.sender,
            amount,
            timestamp,
            userId,
            txRef
        );

        emit ContributionAdded(
            txRef,
            equbId,
            amount,
            timestamp
        );
    }

    function getContribution(string memory txRef) 
        public 
        view 
        returns (Contribution memory) 
    {
        require(bytes(txRef).length > 0, "TxRef cannot be empty");
        require(contributions[txRef].timestamp > 0, "Contribution not found");
        return contributions[txRef];
    }

    function getContributionsByEqubId(string memory equbId)
        public
        view
        returns (Contribution[] memory)
    {
        require(bytes(equbId).length > 0, "EqubId cannot be empty");
        string[] memory txRefs = equbContributions[equbId];
        Contribution[] memory equbContribs = new Contribution[](txRefs.length);
        
        for (uint i = 0; i < txRefs.length; i++) {
            equbContribs[i] = contributions[txRefs[i]];
        }
        
        return equbContribs;
    }

    function getContributionCount(string memory equbId)
        public
        view
        returns (uint256)
    {
        require(bytes(equbId).length > 0, "EqubId cannot be empty");
        return equbContributions[equbId].length;
    }

    // Add function to get total contributions
    function getTotalContributions() public view returns (uint256) {
        return totalContributions;
    }
}