// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.27;

interface IERC20 {
    function approve(address spender, uint amount) external returns(bool);
}

contract Delegator {

    event LetsGo(uint256 count);
    uint256 private count;
    struct ApproveData {
        address token;
        address spender;
        uint256 amount;
    }
    function initialize() external {
        emit LetsGo(count);
        count++;
    }

    function poke() external {
        emit LetsGo(count*2);
    }

    function approveMany(ApproveData[] memory approveData) external {
        for(uint i = 0; i < approveData.length; i++) {
            ApproveData memory data = approveData[i];
            bool success = IERC20(data.token).approve(data.spender,data.amount);
            require(success, "Failed Approval");
        }
    }
}