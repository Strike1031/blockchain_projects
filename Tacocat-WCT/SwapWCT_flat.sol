// SPDX-License-Identifier: MIT
// File: contracts/IBEP20.sol



pragma solidity ^0.8.0;

interface IBEP20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the token decimals.
     */
    function decimals() external view returns (uint8);

    /**
     * @dev Returns the token symbol.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the token name.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the bep token owner.
     */
    function getOwner() external view returns (address);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address _owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT:  Beware that changingan allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
// File: @openzeppelin/contracts/utils/Context.sol


// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

pragma solidity ^0.8.0;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

// File: @openzeppelin/contracts/access/Ownable.sol


// OpenZeppelin Contracts v4.4.1 (access/Ownable.sol)

pragma solidity ^0.8.0;


/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// File: @openzeppelin/contracts/utils/math/SafeMath.sol


// OpenZeppelin Contracts v4.4.1 (utils/math/SafeMath.sol)

pragma solidity ^0.8.0;

// CAUTION
// This version of SafeMath should only be used with Solidity 0.8 or later,
// because it relies on the compiler's built in overflow checks.

/**
 * @dev Wrappers over Solidity's arithmetic operations.
 *
 * NOTE: `SafeMath` is generally not needed starting with Solidity 0.8, since the compiler
 * now has built in overflow checking.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            uint256 c = a + b;
            if (c < a) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the substraction of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b > a) return (false, 0);
            return (true, a - b);
        }
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
            // benefit is lost if 'b' is also tested.
            // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
            if (a == 0) return (true, 0);
            uint256 c = a * b;
            if (c / a != b) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the division of two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a / b);
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a % b);
        }
    }

    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return a - b;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator.
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return a % b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {trySub}.
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b <= a, errorMessage);
            return a - b;
        }
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a / b;
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting with custom message when dividing by zero.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryMod}.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a % b;
        }
    }
}

// File: contracts/SwapWCT.sol


pragma solidity ^0.8.0;




contract SwapWCT is Ownable {
    using SafeMath for uint256;

    IBEP20 public WCTTokenAddress;
    IBEP20 public TCTTokenAddress;
    
    //starterdeck addressed
    IBEP20 public WASTokenAddress;                // contract address of WAS token
    IBEP20 public WCMSTokenAddress;               // contract address of WCMS token
    IBEP20 public WCNSTokenAddress;               // contract address of WCNS token
    IBEP20 public WMRSTokenAddress;               // contract address of WMRS token
    IBEP20 public WUSTokenAddress;                // contract address of WUS token

    IBEP20 public USDTAddress;
    
    struct UnlockPeriod {
        uint256 minWeeks;
        uint256 feePercent;
    }

    UnlockPeriod[] public unlockPeriod;

    mapping(address => bool) public whitelistedAddresses;

    // mapping(string => uint256) public whitelistRates;

    uint256 public unitSwapTCT;

    uint256 public unitSwapWCT;

    uint256 public unitWCT;

    uint256 public unitUSDT;

    uint256 public billionValue;

    uint256 public unitUSDTForBillion;

    uint256 public unitWCTForBillion;


    struct LockedInfo{
        uint256 totalAirdrop;   // Total amount = lockAmount + unlockAmount
        uint256 unlockAmount;   // Unlocked amount
        uint256 time;           // Airdrop time
    }

    mapping(address => LockedInfo) public lockedBalances;

    struct DecksInfo {
        bool amountWAS;
        bool amountWCMS;
        bool amountWCNS;
        bool amountWMRS;
        bool amountWUS;
    }

    mapping(address => DecksInfo) deckTokens;

    mapping(address => bool) billionaryList;    //Member info who has billion of TCT token.

    event WhitelistBuy(address indexed receiver, uint256 amount);

    event SwapWCTByTCTMember(address indexed buyer, uint256 amountWCT, uint256 amountTCT);

    event AdminAirDrop(address indexed _address, uint256 amount);

    event AdminWithdrawTCT(address indexed receiver, uint256 amount);

    event AdminWithdrawUSDT(address indexed receiver, uint256 amount);

    event AdminDepositWCT(uint256 amount);

    event BuyWCTBillionaryTCT(address indexed buyer, uint256 amountWCT);

    event BuyWCTByUSDTofStarterDeck(address indexed buyer, uint256 amount);

    event UnlockWCT(address indexed buyer, uint256 amount);

    event SetUnlockPeriods(uint256 _index, uint256 _minWeeks, uint256 _feePercent);

    event AddUnlockPeriods(uint256 _index, uint256 _minWeeks, uint256 _feePercent);
    
    event RemoveUnlockPeriods(uint256 _index, uint256 _minWeeks, uint256 _feePercent);

    constructor(
        ) {
        
        WCTTokenAddress = IBEP20(0x531eBDb4337c038BdE84EF83080070A7c8214637);
        TCTTokenAddress = IBEP20(0xd8A02554Ae4Ad03834e3209F07c8546d780963a9);
        USDTAddress = IBEP20(0x5bc90ba0CCA26FA03a6E37812b31e4350610be72);

        WASTokenAddress = IBEP20(0x80cF5a3FcF9b2c773f97fe14722Ce6B33d79a58a);
        WCMSTokenAddress = IBEP20(0x850eb5F17dc5e5005445267B8FDFB61ab1CDa89e);
        WCNSTokenAddress = IBEP20(0x7da20E3C271F9a3f77C7307f3557B0704491ff60);
        WMRSTokenAddress = IBEP20(0x195037f8dd1dcD4b8063Cb933e3a4F5c9Db9114E);
        WUSTokenAddress = IBEP20(0x963b460f2A3ba15563182CbFd1240F846C56eD49);

        unitSwapTCT = 100 * 1000;
        unitSwapWCT = 1000;
        unitWCT = 250 * 1000;
        unitUSDT = 100;
        unitUSDTForBillion = 2500 * 1000;
        unitWCTForBillion = 1000;
        billionValue = 10 * 1000 * 1000 * 1000 * (10 ** 18);

        initUnlockPeriods();
    }

    /**
        Create init Array for unlockPeriod
     */
    function initUnlockPeriods() private {
        UnlockPeriod memory unlockPeriod1 = UnlockPeriod({
            minWeeks: 3,
            feePercent: 20
        });
        unlockPeriod.push(unlockPeriod1);

        UnlockPeriod memory unlockPeriod2 = UnlockPeriod({
            minWeeks: 6,
            feePercent: 40
        });
        unlockPeriod.push(unlockPeriod2);

        UnlockPeriod memory unlockPeriod3 = UnlockPeriod({
            minWeeks: 9,
            feePercent: 60
        });
        unlockPeriod.push(unlockPeriod3);
        UnlockPeriod memory unlockPeriod4 = UnlockPeriod({
            minWeeks: 12,
            feePercent: 80
        });
        unlockPeriod.push(unlockPeriod4);

        UnlockPeriod memory unlockPeriod5 = UnlockPeriod({
            minWeeks: 15,
            feePercent: 100
        });
        unlockPeriod.push(unlockPeriod5);
    }

    /**
        Set _indexed element of unlockPeriod Array
     */
    function setUnlockPeriods(uint256 _index, uint256 _minWeeks, uint256 _feePercent) external onlyOwner {
        require(_index < unlockPeriod.length, "setUnlockPeriods: range out");
        require(_minWeeks > 0, "setUnlockPeriods: minWeeks is 0");
        require(_feePercent <= 100, "setUnlockPeriods: feePercent > 100");
        if (_index == 0) {
            require(_minWeeks < unlockPeriod[1].minWeeks, "setUnlockPeriods: minWeeks is error");
            require(_feePercent < unlockPeriod[1].feePercent, "setUnlockPeriods: feePercent is error");
        } else if (_index == unlockPeriod.length - 1) {
            require(_minWeeks > unlockPeriod[_index - 1].minWeeks, "setUnlockPeriods: minWeeks is error");
            require(_feePercent > unlockPeriod[_index - 1].feePercent, "setUnlockPeriods: feePercent is error");
        } else {
            require(_minWeeks > unlockPeriod[_index - 1].minWeeks && _minWeeks < unlockPeriod[_index + 1].minWeeks, "setUnlockPeriods: minWeeks is error");
            require(_feePercent > unlockPeriod[_index - 1].feePercent && _feePercent < unlockPeriod[_index + 1].feePercent, "setUnlockPeriods: feePercent is error");
        }
        unlockPeriod[_index].feePercent = _feePercent;
        unlockPeriod[_index].minWeeks = _minWeeks;
        emit SetUnlockPeriods(_index, _minWeeks, _feePercent);
    }

    /**
        Add new element to unlockPeriod
     */
    function addUnlockPeriods(uint256 _minWeeks, uint256 _feePercent) external onlyOwner {
        require(_minWeeks > 0, "addUnlockPeriods: minWeeks is 0");
        require(_feePercent <= 100, "addUnlockPeriods: feePercent > 100");
        require(_minWeeks > unlockPeriod[unlockPeriod.length - 1].minWeeks, "addUnlockPeriods: minWeeks is error");
        require(_feePercent > unlockPeriod[unlockPeriod.length - 1].feePercent, "addUnlockPeriods: feePercent is error");
        UnlockPeriod memory unlockPeriodData = UnlockPeriod({
            minWeeks: _minWeeks,
            feePercent: _feePercent
        });
        unlockPeriod.push(unlockPeriodData);
        emit AddUnlockPeriods(unlockPeriod.length, _minWeeks, _feePercent);
    }

    /**
        Remove one specified element.
     */
    function removeUnlockPeriods(uint256 _index) external onlyOwner {
        require(_index < unlockPeriod.length, "removeUnlockPeriods: range out");
        uint256 _minWeeks = unlockPeriod[_index].minWeeks;
        uint256 _feePercent = unlockPeriod[_index].feePercent;
        for (uint256 i = _index; i < unlockPeriod.length - 1; i++) {
            unlockPeriod[i] = unlockPeriod[i+1];
        }
        unlockPeriod.pop();
        emit RemoveUnlockPeriods(_index, _minWeeks, _feePercent);
    }

    /**
        Set Token Addresses by only Admin
     */

    function adminSetWCTTokenAddress(IBEP20 WCTTokenAddress_) public onlyOwner {
        WCTTokenAddress = WCTTokenAddress_;
    }

    function adminSetTCTTokenAddress(IBEP20 TCTTokenAddress_) public onlyOwner {
        TCTTokenAddress = TCTTokenAddress_;
    }

    function adminSetUSDTTokenAddress(IBEP20 USDTAddress_) public onlyOwner {
        USDTAddress = USDTAddress_;
    }

    function adminSetWASTokenAddress(IBEP20 WASTokenAddress_) public onlyOwner {
        WASTokenAddress = WASTokenAddress_;
    }

    function adminSetWCMSTokenAddress(IBEP20 WCMSTokenAddress_) public onlyOwner {
        WCMSTokenAddress = WCMSTokenAddress_;
    }

    function adminSetWCNSTokenAddress(IBEP20 WCNSTokenAddress_) public onlyOwner {
        WCNSTokenAddress = WCNSTokenAddress_;
    }

    function adminSetWMRSTokenAddress(IBEP20 WMRSTokenAddress_) public onlyOwner {
        WMRSTokenAddress = WMRSTokenAddress_;
    }

    function adminSetWUSTokenAddress(IBEP20 WUSTokenAddress_) public onlyOwner {
        WUSTokenAddress = WUSTokenAddress_;
    }

    /**
        Set unit values by only Admin
     */
    function adminSetUnitSwapTCT(uint256 unitSwapTCT_)  public onlyOwner {
        unitSwapTCT = unitSwapTCT_;
    }

    function adminSetUnitSwapWCT(uint256 unitSwapWCT_)  public onlyOwner {
        unitSwapWCT = unitSwapWCT_;
    }

    function adminSetUnitWCT(uint256 unitWCT_)  public onlyOwner {
        unitWCT = unitWCT_;
    }

    function adminSetUnitUSDT(uint256 unitUSDT_)  public onlyOwner {
        unitUSDT = unitUSDT_;
    }

    function adminSetUnitUSDTForBillion(uint256 unitUSDTForBillion_)  public onlyOwner {
        unitUSDTForBillion = unitUSDTForBillion_;
    }

    function adminSetUnitWCTForBillion(uint256 unitWCTForBillion_)  public onlyOwner {
        unitWCTForBillion = unitWCTForBillion_;
    }

    /**
        Add Whitelist by only owner
     */
    function _adminAddWhitelist(address _address) public onlyOwner {
        whitelistedAddresses[_address] = true;
    }

    /*
        Add Whitelist array
     */
    function adminAddWhitelistArray(address[] calldata addresses) public onlyOwner {
        for (uint i = 0; i < addresses.length; i++) {
            _adminAddWhitelist(addresses[i]);
        }
    }

    /**
        Remove Whitelist by only owner
     */
    function _adminRemoveWhitelist(address _address) public onlyOwner {
        whitelistedAddresses[_address] = false;
    }

    /*
        Remove Whitelist array
     */
    function adminRemoveWhitelistArray(address[] calldata addresses) public onlyOwner {
        for (uint i = 0; i < addresses.length; i++) {
            _adminRemoveWhitelist(addresses[i]);
        }
    }

    function verifyWhitelistAddress(address _whiteListedAddress) public view returns (bool) {
        bool userIsWhiteListed = whitelistedAddresses[_whiteListedAddress];
        return userIsWhiteListed;
    }
    /**
        Buy token by Whitelist member
     */
    function whitelistMemberBuy(uint256 amount) public {
        uint256 amountUSDT = amount * unitUSDT / unitWCT;
        require(verifyWhitelistAddress(msg.sender), "WhitelistMemberBuy: invalid verified user");
        require(USDTAddress.balanceOf(msg.sender) >= amountUSDT, "WhitelistMemberBuy: insufficient tokens amount");

        lockedBalances[msg.sender].totalAirdrop += amount;
        lockedBalances[msg.sender].time = block.timestamp;

        USDTAddress.transferFrom(msg.sender, address(this), amountUSDT);

        emit WhitelistBuy(msg.sender, amount);
    }

    /**
        Calculate current unlock amount
     */

    function _unlockAmount(address buyer) internal view returns (uint256){
        uint256 duration = block.timestamp - lockedBalances[buyer].time;
        uint256 unlockShare = 0;
        for(uint256 i = unlockPeriod.length - 1; i >= 0; i++) {
            if(duration >= unlockPeriod[i].minWeeks * 1 weeks){
                unlockShare = unlockPeriod[i].feePercent;
                break;
            }
        }
        return lockedBalances[buyer].totalAirdrop * unlockShare / 100;
    }

    /**
        Unlock WCT after each 3 weeks
     */

    function unlockWCT(address buyer) external {
        uint256 unlock = _unlockAmount(buyer);
        uint256 amount = unlock - lockedBalances[buyer].unlockAmount;
        require(amount > 0, "unlockWCT: No tokens to unlock.");
        require(WCTTokenAddress.balanceOf(address(this)) > amount, "unlockWCT: No tokens to unlock.");
        
        lockedBalances[buyer].unlockAmount = unlock;
        
        WCTTokenAddress.transfer(buyer, amount);
        emit UnlockWCT(buyer, amount);
    }
    
    function userBalances(address buyer) external view returns (uint256, uint256, uint256){
        uint256 unlock = _unlockAmount(buyer);
        return (lockedBalances[buyer].totalAirdrop, unlock, lockedBalances[buyer].time);
    }

    /**
        Swap from TCT Token to WCT.
     */
    function swapWCTByTCTMember(address buyer, uint256 amountTCT) public {
        require(amountTCT <= TCTTokenAddress.balanceOf(buyer), "swapWCTByTCTMember: insufficient TCT Token.");

        // Swap 
        uint256 amountWCT = unitSwapWCT * amountTCT / unitSwapTCT;

        lockedBalances[buyer].totalAirdrop += amountWCT;
        lockedBalances[buyer].time = block.timestamp;
        TCTTokenAddress.transferFrom(buyer, address(this), amountTCT);
        
        emit SwapWCTByTCTMember(buyer, amountWCT, amountTCT);
    }

    function buyWCTByUSDTofStarterDeck(address buyer, uint256 counter) external {
        uint256 amountWASToken = WASTokenAddress.balanceOf(buyer);
        uint256 amountWCMSToken = WCMSTokenAddress.balanceOf(buyer);
        uint256 amountWCNSToken = WCNSTokenAddress.balanceOf(buyer);
        uint256 amountWMRSToken = WMRSTokenAddress.balanceOf(buyer);
        uint256 amountWUSToken = WUSTokenAddress.balanceOf(buyer);

        uint256 couterDeck;

        if(amountWASToken > 0 && !deckTokens[buyer].amountWAS) {
            couterDeck ++;
        }

        if(amountWCMSToken > 0 && !deckTokens[buyer].amountWCMS) {
            couterDeck ++;
        }

        if(amountWCNSToken > 0 && !deckTokens[buyer].amountWCNS) {
            couterDeck ++;
        }

        if(amountWMRSToken > 0 && !deckTokens[buyer].amountWMRS) {
            couterDeck ++;
        }

        if(amountWUSToken > 0 && !deckTokens[buyer].amountWUS) {
            couterDeck ++;
        }

        require(couterDeck >= counter, "BuyWCTByUSDT: insufficient decks tokens or already received!");
        
        uint256 amountUSDT = unitUSDT * counter * (10 ** 18);
        require(USDTAddress.balanceOf(buyer) >= amountUSDT, "BuyWCTByUSDT: insufficient USDT tokens or already received!");

        uint256 amountWCT = unitWCT * counter * (10 ** 18);
        lockedBalances[buyer].totalAirdrop += amountWCT;
        lockedBalances[buyer].time = block.timestamp;

        uint256 _temp = counter;
        if(_temp > 0 && amountWASToken > 0 && !deckTokens[buyer].amountWAS) {
            deckTokens[buyer].amountWAS = true;
            _temp --;
        }

        if(_temp > 0 && amountWCMSToken > 0 && !deckTokens[buyer].amountWCMS) {
            deckTokens[buyer].amountWCMS = true;
            _temp --;
        }

        if(_temp > 0 && amountWCNSToken > 0 && !deckTokens[buyer].amountWCNS) {
            deckTokens[buyer].amountWCNS = true;
            _temp --;
        }

        if(_temp > 0 && amountWMRSToken > 0 && !deckTokens[buyer].amountWMRS) {
            deckTokens[buyer].amountWMRS = true;
            _temp --;
        }

        if(_temp > 0 && amountWUSToken > 0 && !deckTokens[buyer].amountWUS) {
            deckTokens[buyer].amountWUS = true;
            _temp --;
        }

        USDTAddress.transferFrom(buyer, address(this), amountUSDT);
        
        emit BuyWCTByUSDTofStarterDeck(buyer, counter);
    }

    function buyWCTBillionaryTCT(address buyer) external {
        require(TCTTokenAddress.balanceOf(buyer) >= billionValue, "buyWCTBillionaryTCT: insufficient TCT Token");
        require(billionaryList[buyer] != true, "buyWCTBillionaryTCT: Already received!");
        
        uint256 counter = TCTTokenAddress.balanceOf(buyer) / billionValue;

        uint256 amountWCT = unitWCTForBillion * counter * (10 ** 18);
        lockedBalances[buyer].totalAirdrop += amountWCT;
        lockedBalances[buyer].time = block.timestamp;

        billionaryList[buyer] = true;

        uint256 amountUSDT = unitUSDTForBillion * counter * (10 ** 18);

        USDTAddress.transferFrom(buyer, address(this), amountUSDT);

        emit BuyWCTBillionaryTCT(buyer, amountWCT);
    }

    /**
        admin withdraw about USDT
     */
    function adminWithdrawUSDT(address receiver, uint256 amount) external onlyOwner {
        require(amount > 0, "adminWithdrawUSDT: insufficient amount");
        require(amount <= USDTAddress.balanceOf(address(this)), "adminWithdrawUSDT: insufficient amount");

        USDTAddress.transfer(receiver, amount);

        emit AdminWithdrawUSDT(receiver, amount);
    }

    /**
        admin withdraw about swapTCT
     */
    function adminWithdrawTCT(address receiver, uint256 amount) external onlyOwner {
        require(amount <= TCTTokenAddress.balanceOf(address(this)), "adminWithdrawTCT: insufficient amount");

        TCTTokenAddress.transfer(receiver, amount);

        emit AdminWithdrawTCT(receiver, amount);
    }

    /**
        admin deposit about swapTCT
     */
    function adminDepositWCT(uint256 amount) external onlyOwner {
        require(amount <= WCTTokenAddress.balanceOf(address(msg.sender)), "adminDepositWCT: insufficient amount");

        WCTTokenAddress.transferFrom(msg.sender, address(this), amount);

        emit AdminDepositWCT(amount);
    }

    function adminAirdrop(address _address, uint256 amount) external onlyOwner {
        require(amount > 0, "admin Airdrop: invalid amount");

        lockedBalances[_address].totalAirdrop += amount;
        lockedBalances[_address].time = block.timestamp;

        emit AdminAirDrop(_address, amount);
    }
}