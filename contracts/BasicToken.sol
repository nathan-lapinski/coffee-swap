// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

// This is a very basic token contract which implements
// some of the ERC20 spec by hand. In an effort to lay bare
// how the spec works, this contract does not use OpenZepplin's ERC20 contracts.
// Those are used by the Token.sol contract
contract BasicToken {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;

    // Initializes token data, and assigns all supply to deployer of this contract
    constructor(string memory name_, string memory symbol_, uint256 total_) {
        _name = name_;
        _symbol = symbol_;
        _totalSupply = total_;
        _balances[msg.sender] = _totalSupply;
    }

    function balanceOf(address owner_) public view returns (uint256) {
        return _balances[owner_];
    }

    function transfer(address receiver_, uint256 amount_) public returns (bool) {
        require(_balances[msg.sender] >= amount_, "transfer amount exceeds account balance");
        _balances[msg.sender] -= amount_;
        _balances[receiver_] += amount_;
        return true;
    }

    function transferFrom(address owner_, address receiver_, uint amount_) public returns (bool) {
        require(_balances[owner_] >= amount_, "amount exceeds owner's balance");
        require(_allowances[owner_][msg.sender] >= amount_, "amount exceeds your allowance for this account");
        _balances[owner_] -= amount_;
        _allowances[owner_][msg.sender] -= amount_;
        _balances[receiver_] += amount_;
        return true;
    }

    function approve(address delegate_, uint256 amount_) public returns (bool) {
        require(_balances[msg.sender] >= amount_, "delgation amount exceeds account balance");
        _allowances[msg.sender][delegate_] = amount_;
        return true;
    }

    // view functions
    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function decimals() public pure returns(uint8) {
        return 18;
   }

   function allowance(address _owner, address _delegate) public view returns (uint256) {
      return _allowances[_owner][_delegate];
   }
}