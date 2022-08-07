// SPDX-License-Identifier: GPL-3.0 License
pragma solidity ^0.8.3;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Planet Neo Marketplace
 */

contract PNMarket is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;

    IERC721 public nftContract;

    Counters.Counter public marketItemCounter; // counter of market item
    struct MarketItem {
        uint256 id; // item id
        uint256 tokenId; // token id on nft contract
        address payable seller; // item seller
        address buyer; // item buyer
        uint256 price; // item price
        uint256 startDate; // date of item added on the market
        uint256 endDate; // date of item sold on the market
        bool sold; // flag of token sold or not
        bool cancelled; // flag of token cancelled or not
        bool auction; // flag of token is auction or not
    }
    mapping(uint256 => MarketItem) public marketItemList; // list of auction info (id => item)

    struct AuctionInfo {
        uint256 duration; // duration of auction with days
        address payable last_bidder; // last bidder
        uint256 last_price; // item price
        uint256 bidCount; // number of bids
    }
    mapping(uint256 => AuctionInfo) public auctionInfoList; // list of market item (id => info)

    event AddMarketItemForSale(
        uint256 id,
        address indexed seller,
        uint256 tokenId,
        uint256 price
    );

    event ChangeMarketItemPriceForSale(
        uint256 id,
        address indexed seller,
        uint256 price
    );

    event CancelMarketItem(uint256 id, address indexed seller);

    event BuyMarketItemForSale(
        uint256 id,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );

    event AddMarketItemForAuction(
        uint256 id,
        address indexed seller,
        uint256 tokenId,
        uint256 minPrice,
        uint256 duration
    );

    event BidMarketItemForAuction(
        uint256 id,
        address indexed bidder,
        uint256 price,
        address indexed previous_bidder,
        uint256 previous_price
    );

    event EndMarketItemForAuction(
        uint256 id,
        address indexed caller,
        address indexed last_bidder,
        uint256 price,
        address indexed seller,
        uint256 minPrice,
        uint256 duration,
        uint256 bidCount
    );

    event CancelMarketItemForAuction(
        uint256 id,
        address indexed caller,
        address indexed seller,
        uint256 minPrice,
        uint256 duration
    );

    modifier tokenOwner(uint256 tokenId) {
        require(
            nftContract.ownerOf(tokenId) == msg.sender,
            "PNMaket: Not token owner"
        );
        _;
    }

    modifier tokenApproved(uint256 tokenId) {
        require(
            nftContract.getApproved(tokenId) == address(this),
            "PNMaket: Not approved token"
        );
        _;
    }

    modifier itemOwner(uint256 id) {
        require(
            marketItemList[id].seller == msg.sender,
            "PNMaket: Not item owner"
        );
        _;
    }

    modifier isItemAvailable(uint256 id) {
        require(id < marketItemCounter.current(), "PNMarket: Invalid item Id");
        require(
            marketItemList[id].sold == false,
            "PNMarket: Item already sold"
        );
        require(
            marketItemList[id].cancelled == false,
            "PNMarket: Item already cancelled on the market"
        );
        _;
    }

    modifier isItemForSale(uint256 id) {
        require(id < marketItemCounter.current(), "PNMarket: Invalid item Id");
        require(
            marketItemList[id].auction == false,
            "PNMarket: Item is for Auction, not for Sale"
        );
        _;
    }

    modifier isItemForAuction(uint256 id) {
        require(id < marketItemCounter.current(), "PNMarket: Invalid item Id");
        require(
            marketItemList[id].auction == true,
            "PNMarket: Item is for Sale, not for Auction"
        );
        _;
    }

    /**
     * @dev Constructor
     *
     * @param _nftContract NFT contract address
     **/
    constructor(address _nftContract) {
        require(
            _nftContract != address(0),
            "PNMarket: Nft contract address should not be the Zero address"
        );
        nftContract = IERC721(_nftContract);
    }

    /**
     * @dev Add item on the market for sale
     *
     * @param tokenId token id on the nft contract
     * @param price sale price on the market
     */
    function addMarketItemForSale(uint256 tokenId, uint256 price)
        public
        nonReentrant
        tokenOwner(tokenId)
        tokenApproved(tokenId)
    {
        require(price > 0, "PNMarket: Item price should be positive number");

        MarketItem memory _marketItem = MarketItem(
            marketItemCounter.current(),
            tokenId,
            payable(msg.sender),
            address(0),
            price,
            block.timestamp,
            0,
            false,
            false,
            false
        );
        marketItemList[marketItemCounter.current()] = _marketItem;

        marketItemCounter.increment();

        nftContract.transferFrom(msg.sender, address(this), tokenId);

        emit AddMarketItemForSale(_marketItem.id, msg.sender, tokenId, price);
    }

    /**
     * @dev Change price of item on the market
     *
     * @param id item id on the market
     * @param price sale price on the market
     */
    function changeMarketItemPrice(uint256 id, uint256 price)
        public
        nonReentrant
        isItemAvailable(id)
        isItemForSale(id)
        itemOwner(id)
    {
        require(price > 0, "PNMarket: Item price should be positive number");

        MarketItem storage _marketItem = marketItemList[id];
        _marketItem.price = price;

        emit ChangeMarketItemPriceForSale(id, msg.sender, price);
    }

    /**
     * @dev Cancel item for sale on the market
     *
     * @param id item id on the market
     */
    function cancelMarketItem(uint256 id)
        public
        nonReentrant
        isItemAvailable(id)
        isItemForSale(id)
        itemOwner(id)
    {
        MarketItem storage _marketItem = marketItemList[id];
        _marketItem.endDate = block.timestamp;
        _marketItem.cancelled = true;

        nftContract.transferFrom(
            address(this),
            msg.sender,
            _marketItem.tokenId
        );

        emit CancelMarketItem(id, msg.sender);
    }

    /**
     * @dev Buy item for sale on the market
     *
     * @param id item id on the market
     */
    function buyMarketItem(uint256 id)
        public
        payable
        nonReentrant
        isItemAvailable(id)
        isItemForSale(id)
    {
        MarketItem storage _marketItem = marketItemList[id];
        require(msg.value == _marketItem.price, "PNMarket: Incorrect price");

        _marketItem.buyer = msg.sender;
        _marketItem.endDate = block.timestamp;
        _marketItem.sold = true;

        _marketItem.seller.transfer(msg.value);
        nftContract.transferFrom(
            address(this),
            msg.sender,
            _marketItem.tokenId
        );

        emit BuyMarketItemForSale(
            id,
            msg.sender,
            _marketItem.seller,
            msg.value
        );
    }

    /**
     * @dev Add item on the market
     *
     * @param tokenId token id on the nft contract
     * @param minPrice sale price on the market
     * @param duration duration for auction on the market
     */
    function addMarketItemForAuction(
        uint256 tokenId,
        uint256 minPrice,
        uint256 duration
    ) public nonReentrant tokenOwner(tokenId) tokenApproved(tokenId) {
        require(minPrice > 0, "PNMarket: Min price should be positive number");
        require(duration > 0, "PNMarket: Duration should be positive number");

        MarketItem memory _marketItem = MarketItem(
            marketItemCounter.current(),
            tokenId,
            payable(msg.sender),
            address(0),
            minPrice,
            block.timestamp,
            0,
            false,
            false,
            true
        );
        marketItemList[marketItemCounter.current()] = _marketItem;
        AuctionInfo memory _auctionInfo = AuctionInfo(
            duration,
            payable(address(0)),
            0,
            0
        );
        auctionInfoList[marketItemCounter.current()] = _auctionInfo;

        marketItemCounter.increment();

        nftContract.transferFrom(msg.sender, address(this), tokenId);

        emit AddMarketItemForAuction(
            _marketItem.id,
            msg.sender,
            tokenId,
            minPrice,
            duration
        );
    }

    /**
     * @dev Buy item for sale on the market
     *
     * @param id item id on the market
     */
    function bidMarketItemForAuction(uint256 id)
        public
        payable
        nonReentrant
        isItemAvailable(id)
        isItemForAuction(id)
    {
        MarketItem storage _marketItem = marketItemList[id];
        AuctionInfo storage _auctionInfo = auctionInfoList[id];
        bool isFirstBid = _auctionInfo.bidCount == 0;
        if (isFirstBid) {
            // if first bid
            require(
                msg.value > _marketItem.price,
                "PNMarket: Please input higher price than min price"
            );
        } else {
            // if not fist bid
            require(
                msg.value > _auctionInfo.last_price,
                "PNMarket: Please input higher price than the last price"
            );
        }
        require(
            block.timestamp <
                _marketItem.startDate + _auctionInfo.duration * 60 * 60 * 24,
            "PNMarket: Already ended for bidding"
        );

        address payable _previous_bidder = _auctionInfo.last_bidder;
        uint256 _previous_price = _auctionInfo.last_price;

        _auctionInfo.last_bidder = payable(msg.sender);
        _auctionInfo.last_price = msg.value;
        _auctionInfo.bidCount++;

        if (!isFirstBid) {
            // if not first bid, refund to last bidder and update auction info
            _previous_bidder.transfer(_previous_price);
        }

        emit BidMarketItemForAuction(
            id,
            msg.sender,
            msg.value,
            _previous_bidder,
            _previous_price
        );
    }

    /**
     * @dev sell market item for auction to last bidder
     *
     * @param id item id on the market
     */
    function endMarketItemForAuction(uint256 id)
        public
        nonReentrant
        isItemAvailable(id)
        isItemForAuction(id)
    {
        MarketItem storage _marketItem = marketItemList[id];
        AuctionInfo storage _auctionInfo = auctionInfoList[id];
        require(
            block.timestamp >=
                _marketItem.startDate + _auctionInfo.duration * 60 * 60 * 24,
            "PNMarket: Not ended for bidding time"
        );
        require(_auctionInfo.bidCount > 0, "PNMarket: No bids for the auction");

        _marketItem.endDate = block.timestamp;
        _marketItem.sold = true;

        _marketItem.seller.transfer(_auctionInfo.last_price);

        nftContract.transferFrom(
            address(this),
            _auctionInfo.last_bidder,
            _marketItem.tokenId
        );

        emit EndMarketItemForAuction(
            id,
            msg.sender,
            _auctionInfo.last_bidder,
            _auctionInfo.last_price,
            _marketItem.seller,
            _marketItem.price,
            _auctionInfo.duration,
            _auctionInfo.bidCount
        );
    }

    /**
     * @dev cancel market item for auction if no bids after duration
     *
     * @param id item id on the market
     */
    function cancelMarketItemForAuction(uint256 id)
        public
        nonReentrant
        isItemAvailable(id)
        isItemForAuction(id)
    {
        MarketItem storage _marketItem = marketItemList[id];
        AuctionInfo storage _auctionInfo = auctionInfoList[id];
        require(
            block.timestamp >=
                _marketItem.startDate + _auctionInfo.duration * 60 * 60 * 24,
            "PNMarket: Not ended for bidding time"
        );
        require(
            _auctionInfo.bidCount == 0,
            "PNMarket: Cannot cancel for bid existing auctions"
        );

        _marketItem.endDate = block.timestamp;
        _marketItem.cancelled = true;

        nftContract.transferFrom(
            address(this),
            _marketItem.seller,
            _marketItem.tokenId
        );

        emit CancelMarketItemForAuction(
            id,
            msg.sender,
            _marketItem.seller,
            _marketItem.price,
            _auctionInfo.duration
        );
    }
}
