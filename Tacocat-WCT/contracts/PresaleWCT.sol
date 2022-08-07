// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { SafeMath } from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IBEP20 } from "./IBEP20.sol";

contract PresaleWCT is Ownable {
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
    
    // struct for Unlock with period and percent.
    struct UnlockPeriod {
        uint256 minDays;
        uint256 feePercent;
    }

    // Array of UnlockPeriod struct
    UnlockPeriod[] public unlockPeriod;

    mapping(address => bool) public whitelistedAddresses;

    uint256 public unitSwapTCT;

    uint256 public unitSwapWCT;

    uint256 public unitWCT;

    uint256 public unitUSDT;
    
    bool public TCT2WCT;

    // struct for Locked amount info
    struct LockedInfo{
        uint256 totalAirdrop;   // Total amount = lockAmount + unlockAmount
        uint256 unlockedAmount;   // Unlocked amount
    }

    mapping(address => LockedInfo) public lockedBalances;

    bool public unlockStatus;

    uint256 public unlockTime;

    bool public presaleStatus;

    // Events
    event WhitelistBuy(address indexed receiver, uint256 amountUSDT, uint256 amountWCT);

    event BillionairesBuy(address indexed buyer, uint256 amountUSDT, uint256 amountWCT);

    event StarterDeckBuy(address indexed buyer, uint256 amountUSDT, uint256 amountWCT);

    event TCTSwap(address indexed buyer, uint256 amountWCT, uint256 amountTCT);

    event UnlockWCT(address indexed buyer, uint256 amount);

    // admin Events
    event AirDrop(address indexed receiver, uint256 amount);

    event AdminWithdrawTCT(address indexed receiver, uint256 amount);

    event AdminWithdrawUSDT(address indexed receiver, uint256 amount);

    event AdminDepositWCT(uint256 amount);

    event AdminWithdrawWCT(address indexed receiver, uint256 amount);

    event SetUnlockPeriods(uint256 _index, uint256 _minDays, uint256 _feePercent);

    event AddUnlockPeriods(uint256 _index, uint256 _minDays, uint256 _feePercent);
    
    event RemoveUnlockPeriods(uint256 _index, uint256 _minDays, uint256 _feePercent);

    constructor(
        ) {
        
        WCTTokenAddress = IBEP20(0x531eBDb4337c038BdE84EF83080070A7c8214637);
        TCTTokenAddress = IBEP20(0xb036f689bd98B4Bd3BD648FA09A23e54d839A859);
        USDTAddress = IBEP20(0x55d398326f99059fF775485246999027B3197955);

        WASTokenAddress = IBEP20(0x06D8e34c4D2eA294cBEBF8F459a9687EBeb80aa0);
        WCMSTokenAddress = IBEP20(0xabB56A04BF6E174383A5ef897573e44B6c4B7bC1);
        WCNSTokenAddress = IBEP20(0xf36a695000F8a0a3faa28d044a894E62328A5e15);
        WMRSTokenAddress = IBEP20(0xaf471Dc597F303cbB11e24b6D9B83663d33232ca);
        WUSTokenAddress = IBEP20(0xd6ac22b7616377F06a8D736Ed5d0e2897F430553);

        unitSwapTCT = 100 * 1000;
        unitSwapWCT = 1000;

        unitWCT = 250 * 1000;
        unitUSDT = 100;

        initUnlockPeriods();
    }

    /**
        Create init Array for unlockPeriod
     */
    function initUnlockPeriods() private {
        UnlockPeriod memory unlockPeriod1 = UnlockPeriod({
            minDays: 0,
            feePercent: 20
        });
        unlockPeriod.push(unlockPeriod1);

        UnlockPeriod memory unlockPeriod2 = UnlockPeriod({
            minDays: 21,
            feePercent: 40
        });
        unlockPeriod.push(unlockPeriod2);

        UnlockPeriod memory unlockPeriod3 = UnlockPeriod({
            minDays: 42,
            feePercent: 60
        });
        unlockPeriod.push(unlockPeriod3);
        
        UnlockPeriod memory unlockPeriod4 = UnlockPeriod({
            minDays: 63,
            feePercent: 80
        });
        unlockPeriod.push(unlockPeriod4);

        UnlockPeriod memory unlockPeriod5 = UnlockPeriod({
            minDays: 84,
            feePercent: 100
        });
        unlockPeriod.push(unlockPeriod5);
    }

    /**
        Set _indexed element of unlockPeriod Array
     */
    function setUnlockPeriods(uint256 _index, uint256 _minDays, uint256 _feePercent) external onlyOwner {
        require(_index < unlockPeriod.length, "setUnlockPeriods: range out");
        // require(_minDays > 0, "setUnlockPeriods: minDays is 0");
        require(_feePercent <= 100, "setUnlockPeriods: feePercent > 100");
        if (_index == 0) {
            require(_minDays < unlockPeriod[1].minDays, "setUnlockPeriods: minDays is error");
            require(_feePercent < unlockPeriod[1].feePercent, "setUnlockPeriods: feePercent is error");
        } else if (_index == unlockPeriod.length - 1) {
            require(_minDays > unlockPeriod[_index - 1].minDays, "setUnlockPeriods: minDays is error");
            require(_feePercent > unlockPeriod[_index - 1].feePercent, "setUnlockPeriods: feePercent is error");
        } else {
            require(_minDays > unlockPeriod[_index - 1].minDays && _minDays < unlockPeriod[_index + 1].minDays, "setUnlockPeriods: minDays is error");
            require(_feePercent > unlockPeriod[_index - 1].feePercent && _feePercent < unlockPeriod[_index + 1].feePercent, "setUnlockPeriods: feePercent is error");
        }
        unlockPeriod[_index].feePercent = _feePercent;
        unlockPeriod[_index].minDays = _minDays;
        emit SetUnlockPeriods(_index, _minDays, _feePercent);
    }

    /**
        Add new element to unlockPeriod
     */
    function addUnlockPeriods(uint256 _minDays, uint256 _feePercent) external onlyOwner {
        // require(_minDays > 0, "addUnlockPeriods: minDays is 0");
        require(_feePercent <= 100, "addUnlockPeriods: feePercent > 100");
        require(_minDays > unlockPeriod[unlockPeriod.length - 1].minDays, "addUnlockPeriods: minDays is error");
        require(_feePercent > unlockPeriod[unlockPeriod.length - 1].feePercent, "addUnlockPeriods: feePercent is error");
        UnlockPeriod memory unlockPeriodData = UnlockPeriod({
            minDays: _minDays,
            feePercent: _feePercent
        });
        unlockPeriod.push(unlockPeriodData);
        emit AddUnlockPeriods(unlockPeriod.length, _minDays, _feePercent);
    }

    /**
        Remove one specified element.
     */
    function removeUnlockPeriods(uint256 _index) external onlyOwner {
        require(_index < unlockPeriod.length, "removeUnlockPeriods: range out");
        uint256 _minDays = unlockPeriod[_index].minDays;
        uint256 _feePercent = unlockPeriod[_index].feePercent;
        for (uint256 i = _index; i < unlockPeriod.length - 1; i++) {
            unlockPeriod[i] = unlockPeriod[i+1];
        }
        unlockPeriod.pop();
        emit RemoveUnlockPeriods(_index, _minDays, _feePercent);
    }

    /**
        Start Unlock status
     */
    function adminSetUnlockStatus(bool status) public onlyOwner{
        if(unlockStatus == status){
            return;
        }
        unlockStatus = status;
        if(unlockStatus == true){
            unlockTime = block.timestamp;
        }
    }

    /**
        Start PreSale status
     */
    function adminSetPresaleStatus(bool status) public onlyOwner{
        if(presaleStatus == status){
            return;
        }
        presaleStatus = status;
    }

    /**
        Functions for Set Token Addresses by only Admin
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

    function adminSetTCT2WCT(bool tct2wct_) public onlyOwner {
        if(TCT2WCT != tct2wct_){
            TCT2WCT = tct2wct_;
        }
    }

    /**
        Set unit values by only Admin
     */
    function adminSetSwapTCT2WCT(uint256 unitSwapTCT_, uint256 unitSwapWCT_)  public onlyOwner {
        require(unitSwapTCT_ > 0 && unitSwapWCT_ > 0, "adminSetSwapTCT2WCT: invalid input param");
        unitSwapTCT = unitSwapTCT_;
        unitSwapWCT = unitSwapWCT_;
    }

    function adminSetSwapUSDT2WCT(uint256 unitUSDT_, uint256 unitWCT_)  public onlyOwner {
        require(unitUSDT_ > 0 && unitWCT_ > 0, "adminSetSwapTCT2WCT: invalid input param");
        unitUSDT = unitUSDT_;
        unitWCT = unitWCT_;
    }

    /**
        Add Whitelist by only owner
     */
    function adminAddWhitelist(address _address) public onlyOwner {
        whitelistedAddresses[_address] = true;
    }

    /**
        Add Whitelist array
     */
    function adminAddWhitelistArray(address[] calldata addresses) public onlyOwner {
        for (uint i = 0; i < addresses.length; i++) {
            if(whitelistedAddresses[addresses[i]] == false){
                adminAddWhitelist(addresses[i]);
            }
        }
    }

    /**
        Remove Whitelist by only owner
     */
    function adminRemoveWhitelist(address _address) public onlyOwner {
        whitelistedAddresses[_address] = false;
    }

    /**
        Remove Whitelist array
     */
    function adminRemoveWhitelistArray(address[] calldata addresses) public onlyOwner {
        for (uint i = 0; i < addresses.length; i++) {
            if(whitelistedAddresses[addresses[i]] == true){
                adminRemoveWhitelist(addresses[i]);
            }
        }
    }

    /**
        Verify address is in whitelist or not
     */
    function verifyWhitelistAddress(address _whiteListedAddress) public view returns (bool) {
        return whitelistedAddresses[_whiteListedAddress];
    }

    /**
        Calculate current unlock amount
     */
    function _unlockAmount(address buyer) internal view returns (uint256){
        if(unlockStatus == false){
            return 0;
        }
        uint256 duration = block.timestamp - unlockTime;
        for(uint256 i = unlockPeriod.length - 1; i >= 0; i--) {
            if(duration >= unlockPeriod[i].minDays.mul(3600 * 24)){
            // if(duration >= unlockPeriod[i].minDays.mul(5)){
                return lockedBalances[buyer].totalAirdrop * unlockPeriod[i].feePercent / 100;
            }
        }
        return 0;
    }

    /**
        Unlock WCT after each 3 weeks
     */
    function unlockWCT(address buyer) external {
        require(unlockStatus, "unlockWCT: Unlock is not available now.");
        uint256 unlock = _unlockAmount(buyer);
        uint256 amount = unlock - lockedBalances[buyer].unlockedAmount;
        require(amount > 0, "unlockWCT: No tokens to unlock.");
        require(WCTTokenAddress.balanceOf(address(this)) > amount, "unlockWCT: insufficient tokens.");
        
        lockedBalances[buyer].unlockedAmount = unlock;
        
        WCTTokenAddress.transfer(buyer, amount);
        emit UnlockWCT(buyer, amount);
    }
    
    /**
        Get UnlockedAmount information of specify address
     */
    function userBalances(address buyer) external view returns (uint256, uint256, uint256){
        uint256 pendingUnlock = _unlockAmount(buyer) - lockedBalances[buyer].unlockedAmount;
        return (lockedBalances[buyer].totalAirdrop, lockedBalances[buyer].unlockedAmount, pendingUnlock);
    }

    function _addBalance(address receiver, uint256 amountWCT) internal {
        require(receiver != address(0) && amountWCT > 0, "_addBalance: invalid input");
        lockedBalances[receiver].totalAirdrop += amountWCT;
    }

    function _USDT2WCT(uint256 amountUSDT) internal view returns (uint256){
        return amountUSDT * unitWCT / unitUSDT;
    }

    function _TCT2WCT(uint256 amountTCT) internal view returns (uint256){
        return amountTCT * unitSwapWCT / unitSwapTCT;
    }

    /**
        Swap from TCT Token to WCT.
     */
    function SwapWithTCT(address buyer, uint256 amountTCT) public {
        require(TCT2WCT == true, "SwapWithTCT: Convert TCT to WCT not enabled");
        require(presaleStatus == true, "SwapWithTCT: PreSale not available");
        require(amountTCT <= TCTTokenAddress.balanceOf(buyer), "SwapWithTCT: insufficient TCT Token.");

        uint256 amountWCT = _TCT2WCT(amountTCT);
        _addBalance(buyer, amountWCT);

        TCTTokenAddress.transferFrom(buyer, address(this), amountTCT);
        
        emit TCTSwap(buyer, amountWCT, amountTCT);
    }

    /**
        Buy token by Whitelist member
     */
    function buyForWhitelist(uint256 amountUSDT) public {
        require(presaleStatus == true, "buyForWhitelist: PreSale not available");
        require(amountUSDT > 0, "buyForWhitelist: invalid amount of USDT");
        require(verifyWhitelistAddress(msg.sender), "buyForWhitelist: not whitelisted user");
        require(USDTAddress.balanceOf(msg.sender) >= amountUSDT, "buyForWhitelist: insufficient tokens amount");

        uint256 amountWCT = _USDT2WCT(amountUSDT);
        _addBalance(msg.sender, amountWCT);

        USDTAddress.transferFrom(msg.sender, address(this), amountUSDT);

        emit WhitelistBuy(msg.sender, amountUSDT, amountWCT);
    }

    /**
        Buy WCT tokens with USDT if buyer has starterDecks.
     */
    function buyForStarterDeck(address buyer, uint256 amountUSDT) external {
        require(presaleStatus == true, "buyForStarterDeck: PreSale not available");
        uint256 amountWASToken = WASTokenAddress.balanceOf(buyer);
        uint256 amountWCMSToken = WCMSTokenAddress.balanceOf(buyer);
        uint256 amountWCNSToken = WCNSTokenAddress.balanceOf(buyer);
        uint256 amountWMRSToken = WMRSTokenAddress.balanceOf(buyer);
        uint256 amountWUSToken = WUSTokenAddress.balanceOf(buyer);

        uint256 couterDeck = amountWASToken + amountWCMSToken + amountWCNSToken + amountWMRSToken + amountWUSToken;
        uint256 maxUSDT = unitUSDT * couterDeck * (10 ** 18);

        require(amountUSDT > 0 && amountUSDT <= maxUSDT, "buyForStarterDeck: insufficient deck tokens to buy wct");
        require(USDTAddress.balanceOf(buyer) >= amountUSDT, "buyForStarterDeck: insufficient USDT tokens.");

        uint256 amountWCT = _USDT2WCT(amountUSDT);
        _addBalance(msg.sender, amountWCT);

        USDTAddress.transferFrom(buyer, address(this), amountUSDT);
        
        emit StarterDeckBuy(buyer, amountUSDT, amountWCT);
    }

    /**
        Buy WCT tokens if has over billion TCT tokens
     */
    function buyForBillionaires(address buyer, uint256 amountUSDT) external {
        require(presaleStatus == true, "buyForBillionaires: PreSale not available");
        require(amountUSDT > 0, "buyForBillionaires: invalid amount of USDT");
        require(amountUSDT <= USDTAddress.balanceOf(buyer), "buyForBillionaires: insufficient amount of USDT");

        uint256 amountWCT = _USDT2WCT(amountUSDT);
        _addBalance(msg.sender, amountWCT);

        USDTAddress.transferFrom(buyer, address(this), amountUSDT);

        emit BillionairesBuy(buyer, amountUSDT, amountWCT);
    }

    /**
        Admin withdraw about USDT
     */
    function adminWithdrawUSDT(address receiver, uint256 amount) external onlyOwner {
        require(amount > 0, "adminWithdrawUSDT: insufficient amount");
        require(amount <= USDTAddress.balanceOf(address(this)), "adminWithdrawUSDT: insufficient amount");

        USDTAddress.transfer(receiver, amount);

        emit AdminWithdrawUSDT(receiver, amount);
    }

    /**
        Admin withdraw about swapTCT
     */
    function adminWithdrawTCT(address receiver, uint256 amount) external onlyOwner {
        require(amount <= TCTTokenAddress.balanceOf(address(this)), "adminWithdrawTCT: insufficient amount");

        TCTTokenAddress.transfer(receiver, amount);

        emit AdminWithdrawTCT(receiver, amount);
    }

    /**
        Admin deposit wct
     */
    function adminDepositWCT(uint256 amount) external onlyOwner {
        require(amount <= WCTTokenAddress.balanceOf(address(msg.sender)), "adminDepositWCT: insufficient amount");

        WCTTokenAddress.transferFrom(msg.sender, address(this), amount);

        emit AdminDepositWCT(amount);
    }

    /**
        Admin withdraw wct
     */
    function adminWithdrawWCT(address receiver, uint256 amount) external onlyOwner {
        require(amount <= WCTTokenAddress.balanceOf(address(this)), "adminWithdrawWCT: insufficient amount");

        WCTTokenAddress.transfer(receiver, amount);

        emit AdminWithdrawWCT(receiver, amount);
    }

    /**
        Admin force WCT tokens to lockedBalance of specific address
     */
    function _airdrop(address receiver, uint256 amountWCT) internal {
        require(amountWCT > 0, "admin Airdrop: invalid amount");

        _addBalance(receiver, amountWCT);
        
        emit AirDrop(receiver, amountWCT);
    }

    /**
        Admin force WCT tokens to lockedBalance of specific address
     */
    function adminAirdrop(address[] calldata receivers, uint256[] calldata amounts) external onlyOwner {
        require(receivers.length == amounts.length, "admin Airdrop: mismatching count of address and amount");
        for(uint i = 0; i < receivers.length; i ++){
            require(receivers[i] != address(0) && amounts[i] > 0, "admin Airdrop: invalid address or amount");
        }

        for(uint i = 0; i < receivers.length; i ++){
            _airdrop(receivers[i], amounts[i]);
        }
    }
}