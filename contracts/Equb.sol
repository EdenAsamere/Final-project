// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EqubGroup {
    address public admin;

    constructor() {
        admin = msg.sender;
    }
}
