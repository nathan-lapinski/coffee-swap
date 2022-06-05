// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  constructor(
    string memory name,
    string memory symbol,
    uint256 initialSupply
  ) ERC20(name, symbol) {
    // mint initially supply of tokens and give them to token creator
    _mint(msg.sender, initialSupply);
  }

  // test function for minting miner rewards
  function mintMinerReward() public {
    _mint(block.coinbase, 1000);
  }

  function getTotalSupply() external view returns (uint256) {
    return totalSupply();
  }

  function getBalanceOf(address addr) external view returns (uint256) {
    return balanceOf(addr);
  }

  function faucet() public {
    transfer(msg.sender, 500);
  }
}

