const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3 = require("web3");

describe("NFTMarketTestCase", function () {
    const tokenURI = "https://eg-nft-api-dev.herokuapp.com/api/v1/nft/";

    let PNMarketContract;
    let pnMarket;
    let owner, addr1, addr2, addr3, addrs;

    let NFTContract;
    let nftToken;

    const tokenId = 0;
    const priceEth = 1,
        zeroPriceEth = 0;
    const duration = 3,
        zeroDuration = 0;

    const price = Web3.utils.toWei(priceEth.toString(), "ether");
    const zeroPrice = Web3.utils.toWei(zeroPriceEth.toString(), "ether");
    const higherPrice = Web3.utils.toWei((priceEth + 1).toString(), "ether");
    const higherPrice1 = Web3.utils.toWei((priceEth + 2).toString(), "ether");

    let _item;

    /**
     * @detail deploy contract firstly
     * */
    beforeEach(async () => {
        NFTContract = await ethers.getContractFactory("NFT");
        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
        nftToken = await NFTContract.deploy(tokenURI);

        PNMarketContract = await ethers.getContractFactory("PNMarket");
        pnMarket = await PNMarketContract.deploy(nftToken.address);

        await nftToken.setPresaleStatus(false);
        await nftToken.setPublicSaleStatus(true);
        let publicSalePrice = await nftToken.publicSalePrice();
        await nftToken
            .connect(addr1)
            .clientMint(2, { value: publicSalePrice.mul(2) });
        await nftToken.connect(addr1).approve(pnMarket.address, 0);
    });

    /**
     * @detail Deployment test case
     * */
    describe("addMarketItemForSale(uint256 tokenId, uint256 price)", function () {
        it("Require : called by token owner", async () => {
            await expect(
                pnMarket.connect(addr2).addMarketItemForSale(tokenId, price)
            ).to.be.revertedWith("PNMaket: Not token owner");
        });

        it("Require : token approved", async () => {
            await expect(
                pnMarket
                    .connect(addr1)
                    .addMarketItemForSale(
                        (await pnMarket.marketItemCounter()) + 1,
                        price
                    )
            ).to.be.revertedWith("PNMaket: Not approved token");
        });

        it("Require : price > 0", async () => {
            await expect(
                pnMarket.connect(addr1).addMarketItemForSale(tokenId, zeroPrice)
            ).to.be.revertedWith(
                "PNMarket: Item price should be positive number"
            );
        });

        it("Run : item added", async () => {
            await pnMarket.connect(addr1).addMarketItemForSale(tokenId, price);

            _item = await pnMarket.marketItemList(
                (await pnMarket.marketItemCounter()) - 1
            );

            expect(_item.id).to.be.equal(
                (await pnMarket.marketItemCounter()) - 1
            );
            expect(_item.tokenId).to.be.equal(tokenId);
            expect(_item.seller).to.be.equal(addr1.address);
            expect(_item.price).to.be.equal(price);
        });

        it("Run : item counter increased", async () => {
            const _prev_counter = await pnMarket.marketItemCounter();
            await pnMarket.connect(addr1).addMarketItemForSale(tokenId, price);

            expect(await pnMarket.marketItemCounter()).to.be.equal(
                _prev_counter + 1
            );
        });

        it("Run : token transferred", async () => {
            await pnMarket.connect(addr1).addMarketItemForSale(tokenId, price);

            expect(await nftToken.ownerOf(tokenId)).to.be.equal(
                pnMarket.address
            );
        });
    });

    describe("changeMarketItemPrice(uint256 id, uint256 price)", function () {
        beforeEach(async () => {
            await pnMarket.connect(addr1).addMarketItemForSale(tokenId, price);
            _item = await pnMarket.marketItemList(
                (await pnMarket.marketItemCounter()) - 1
            );
        });

        it("Require : call valid item", async () => {
            await expect(
                pnMarket
                    .connect(addr1)
                    .changeMarketItemPrice(_item.id + 1, price)
            ).to.be.revertedWith("PNMarket: Invalid item Id");
        });

        it("Require : called by item owner", async () => {
            await expect(
                pnMarket.connect(addr2).changeMarketItemPrice(_item.id, price)
            ).to.be.revertedWith("PNMaket: Not item owner");
        });

        it("Require : item price should be positive number", async () => {
            await expect(
                pnMarket
                    .connect(addr1)
                    .changeMarketItemPrice(_item.id, zeroPrice)
            ).to.be.revertedWith(
                "PNMarket: Item price should be positive number"
            );
        });

        it("Run : price change", async () => {
            await pnMarket
                .connect(addr1)
                .changeMarketItemPrice(_item.id, price);
            expect(_item.price).to.be.equal(price);
        });
    });

    describe("buyMarketItem(uint256 itemId)", function () {
        beforeEach(async () => {
            await pnMarket.connect(addr1).addMarketItemForSale(tokenId, price);
            _item = await pnMarket.marketItemList(
                (await pnMarket.marketItemCounter()) - 1
            );
        });

        it("Require : call correct item id", async () => {
            await expect(
                pnMarket.connect(addr2).buyMarketItem(_item.id + 1)
            ).to.be.revertedWith("PNMarket: Invalid item Id");
        });

        it("Require : call unsold item", async () => {
            await pnMarket
                .connect(addr2)
                .buyMarketItem(_item.id, { value: price });

            await expect(
                pnMarket
                    .connect(addr3)
                    .buyMarketItem(_item.id, { value: price })
            ).to.be.revertedWith("PNMarket: Item already sold");
        });

        it("Require : same price for selling", async () => {
            await expect(
                pnMarket
                    .connect(addr2)
                    .buyMarketItem(_item.id, { value: higherPrice })
            ).to.be.revertedWith("PNMarket: Incorrect price");
        });

        it("Run : item bought", async () => {
            await pnMarket
                .connect(addr2)
                .buyMarketItem(_item.id, { value: price });

            _item = await pnMarket.marketItemList(
                (await pnMarket.marketItemCounter()) - 1
            );

            expect(_item.buyer).to.be.equal(addr2.address);
            expect(_item.sold).to.be.equal(true);
            expect(_item.price).to.be.equal(price);
        });

        it("Run : token transferred", async () => {
            await pnMarket
                .connect(addr2)
                .buyMarketItem(_item.id, { value: price });
            _item = await pnMarket.marketItemList(
                (await pnMarket.marketItemCounter()) - 1
            );

            expect(await nftToken.ownerOf(_item.tokenId)).to.be.equal(
                addr2.address
            );
        });

        it("Run : balance changed", async () => {
            const addr1_bal = await (
                await ethers.provider.getBalance(addr1.address)
            ).toBigInt();
            await pnMarket
                .connect(addr2)
                .buyMarketItem(_item.id, { value: price });

            expect(
                await (
                    await ethers.provider.getBalance(addr1.address)
                ).toBigInt()
            ).to.be.equal(addr1_bal + BigInt(price));
        });
    });

    describe("cancelMarketItem(uint256 id)", function () {
        beforeEach(async () => {
            await pnMarket.connect(addr1).addMarketItemForSale(tokenId, price);
            _item = await pnMarket.marketItemList(
                (await pnMarket.marketItemCounter()) - 1
            );
        });

        it("Require : called by item owner", async () => {
            await expect(
                pnMarket.connect(addr2).cancelMarketItem(_item.id)
            ).to.be.revertedWith("PNMaket: Not item owner");
        });

        it("Require : call correct item id", async () => {
            await expect(
                pnMarket.connect(addr1).cancelMarketItem(_item.id + 1)
            ).to.be.revertedWith("PNMarket: Invalid item Id");
        });

        it("Require : call cancelled item", async () => {
            await pnMarket.connect(addr1).cancelMarketItem(_item.id);

            await expect(
                pnMarket.connect(addr1).cancelMarketItem(_item.id)
            ).to.be.revertedWith(
                "PNMarket: Item already cancelled on the market"
            );
        });

        it("Run : item cancelled", async () => {
            await pnMarket.connect(addr1).cancelMarketItem(_item.id);

            _item = await pnMarket.marketItemList(
                (await pnMarket.marketItemCounter()) - 1
            );
            expect(_item.cancelled).to.be.equal(true);
        });

        it("Run : token transfered", async () => {
            await pnMarket.connect(addr1).cancelMarketItem(_item.id);

            _item = await pnMarket.marketItemList(
                (await pnMarket.marketItemCounter()) - 1
            );
            expect(await nftToken.ownerOf(_item.tokenId)).to.be.equal(
                addr1.address
            );
        });
    });

    describe("addMarketItemForAuction(uint256 tokenId, uint256 minPrice, uint256 duration)", function () {
        it("Require : called by token owner", async () => {
            await expect(
                pnMarket
                    .connect(addr2)
                    .addMarketItemForAuction(tokenId, price, duration)
            ).to.be.revertedWith("PNMaket: Not token owner");
        });

        it("Require : token approved", async () => {
            await expect(
                pnMarket
                    .connect(addr1)
                    .addMarketItemForAuction(tokenId + 1, price, duration)
            ).to.be.revertedWith("PNMaket: Not approved token");
        });

        it("Require : price > 0", async () => {
            await expect(
                pnMarket
                    .connect(addr1)
                    .addMarketItemForAuction(tokenId, zeroPrice, duration)
            ).to.be.revertedWith(
                "PNMarket: Min price should be positive number"
            );
        });

        it("Require : duration > 0", async () => {
            await expect(
                pnMarket
                    .connect(addr1)
                    .addMarketItemForAuction(tokenId, price, zeroDuration)
            ).to.be.revertedWith(
                "PNMarket: Duration should be positive number"
            );
        });

        it("Run : market item added", async () => {
            await pnMarket
                .connect(addr1)
                .addMarketItemForAuction(tokenId, price, duration);

            _item = await pnMarket.marketItemList(
                (await pnMarket.marketItemCounter()) - 1
            );
            expect(_item.id).to.be.equal(
                (await pnMarket.marketItemCounter()) - 1
            );
            expect(_item.tokenId).to.be.equal(tokenId);
            expect(_item.seller).to.be.equal(addr1.address);
            expect(_item.price).to.be.equal(price);
            expect(_item.sold).to.be.equal(false);
            expect(_item.cancelled).to.be.equal(false);
            expect(_item.auction).to.be.equal(true);
        });

        it("Run : auction info added", async () => {
            await pnMarket
                .connect(addr1)
                .addMarketItemForAuction(tokenId, price, duration);

            const auction_item = await pnMarket.auctionInfoList(
                (await pnMarket.marketItemCounter()) - 1
            );
            expect(auction_item.duration).to.be.equal(duration);
            expect(auction_item.bidCount).to.be.equal(0);
            expect(auction_item.last_price).to.be.equal(0);
        });

        it("Run : item counter increased", async () => {
            const _prev_counter = await pnMarket.marketItemCounter();
            await pnMarket
                .connect(addr1)
                .addMarketItemForAuction(tokenId, price, duration);

            expect(await pnMarket.marketItemCounter()).to.be.equal(
                _prev_counter + 1
            );
        });

        it("Run : token transferred", async () => {
            await pnMarket
                .connect(addr1)
                .addMarketItemForAuction(tokenId, price, duration);
            expect(await nftToken.ownerOf(tokenId)).to.be.equal(
                pnMarket.address
            );
        });
    });

    describe("bidMarketItemForAuction(uint256 id)", function () {
        beforeEach(async () => {
            await pnMarket
                .connect(addr1)
                .addMarketItemForAuction(tokenId, price, duration);
            _item = await pnMarket.marketItemList(
                (await pnMarket.marketItemCounter()) - 1
            );
        });

        it("Require : call correct item id", async () => {
            await expect(
                pnMarket.connect(addr2).bidMarketItemForAuction(_item.id + 1)
            ).to.be.revertedWith("PNMarket: Invalid item Id");
        });

        it("Require : call higher price than min price", async () => {
            await expect(
                pnMarket
                    .connect(addr2)
                    .bidMarketItemForAuction(_item.id, { value: price })
            ).to.be.revertedWith(
                "PNMarket: Please input higher price than min price"
            );
        });

        it("Require : call higher price than last price", async () => {
            await pnMarket
                .connect(addr2)
                .bidMarketItemForAuction(_item.id, { value: higherPrice });

            await expect(
                pnMarket
                    .connect(addr3)
                    .bidMarketItemForAuction(_item.id, { value: higherPrice })
            ).to.be.revertedWith(
                "PNMarket: Please input higher price than the last price"
            );
        });

        it("Require : bid before auction end", async () => {
            await ethers.provider.send("evm_increaseTime", [10 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine");

            await expect(
                pnMarket
                    .connect(addr2)
                    .bidMarketItemForAuction(_item.id, { value: higherPrice })
            ).to.be.revertedWith("PNMarket: Already ended for bidding");
        });

        it("Run : auction info after bid", async () => {
            await pnMarket
                .connect(addr2)
                .bidMarketItemForAuction(_item.id, { value: higherPrice });

            const itemCount = (await pnMarket.marketItemCounter()) - 1;
            _item = await pnMarket.auctionInfoList(itemCount);

            expect(_item.last_bidder).to.be.equal(addr2.address);
            expect(_item.last_price).to.be.equal(higherPrice);
            expect(_item.bidCount).to.be.equal(itemCount + 1);
        });

        it("Run : balance changed", async () => {
            const contract_bal = await (
                await ethers.provider.getBalance(pnMarket.address)
            ).toBigInt();
            await pnMarket
                .connect(addr2)
                .bidMarketItemForAuction(_item.id, { value: higherPrice });

            expect(
                await (
                    await ethers.provider.getBalance(pnMarket.address)
                ).toBigInt()
            ).to.be.equal(contract_bal + BigInt(higherPrice));

            const add2_bal = await (
                await ethers.provider.getBalance(addr2.address)
            ).toBigInt();
            await pnMarket
                .connect(addr3)
                .bidMarketItemForAuction(_item.id, { value: higherPrice1 });

            expect(await ethers.provider.getBalance(addr2.address)).to.be.equal(
                add2_bal + BigInt(higherPrice)
            );
        });
    });

    describe("endMarketItemForAuction(uint256 id)", function () {
        beforeEach(async () => {
            await pnMarket
                .connect(addr1)
                .addMarketItemForAuction(tokenId, price, duration);
            _item = await pnMarket.marketItemList(
                (await pnMarket.marketItemCounter()) - 1
            );
        });

        it("Require : call correct item id", async () => {
            await expect(
                pnMarket.connect(addr1).endMarketItemForAuction(_item.id + 1)
            ).to.be.revertedWith("PNMarket: Invalid item Id");
        });

        it("Require : call unsold item", async () => {
            await pnMarket
                .connect(addr2)
                .bidMarketItemForAuction(_item.id, { value: higherPrice });

            await ethers.provider.send("evm_increaseTime", [10 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine");

            await pnMarket.connect(addr3).endMarketItemForAuction(_item.id);

            await expect(
                pnMarket.connect(addr3).endMarketItemForAuction(_item.id)
            ).to.be.revertedWith("PNMarket: Item already sold");
        });

        it("Require : end bidding time", async () => {
            await expect(
                pnMarket.connect(addr3).endMarketItemForAuction(_item.id)
            ).to.be.revertedWith("PNMarket: Not ended for bidding time");
        });

        it("Require : bid for the auction", async () => {
            await ethers.provider.send("evm_increaseTime", [10 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine");

            await expect(
                pnMarket.connect(addr3).endMarketItemForAuction(_item.id)
            ).to.be.revertedWith("PNMarket: No bids for the auction");
        });

        it("Run : sold item", async () => {
            await pnMarket
                .connect(addr2)
                .bidMarketItemForAuction(_item.id, { value: higherPrice });

            await ethers.provider.send("evm_increaseTime", [10 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine");

            await pnMarket.connect(addr3).endMarketItemForAuction(_item.id);

            _item = await pnMarket.marketItemList(
                (await pnMarket.marketItemCounter()) - 1
            );
            expect(_item.sold).to.be.equal(true);
        });

        it("Run : balance changed", async () => {
            await pnMarket
                .connect(addr2)
                .bidMarketItemForAuction(_item.id, { value: higherPrice });

            await ethers.provider.send("evm_increaseTime", [10 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine");

            const add1_bal = await (
                await ethers.provider.getBalance(addr1.address)
            ).toBigInt();
            await pnMarket.connect(addr3).endMarketItemForAuction(_item.id);

            expect(
                await (
                    await ethers.provider.getBalance(addr1.address)
                ).toBigInt()
            ).to.be.equal(add1_bal + BigInt(higherPrice));
        });

        it("Run : token transferred", async () => {
            const auction_item = await pnMarket.auctionInfoList(
                (await pnMarket.marketItemCounter()) - 1
            );
            expect(
                await nftToken.ownerOf(auction_item.last_bidder)
            ).to.be.equal(pnMarket.address);
        });
    });

    describe("cancelMarketItemForAuction(uint256 id)", function () {
        beforeEach(async () => {
            await pnMarket
                .connect(addr1)
                .addMarketItemForAuction(tokenId, price, duration);
            _item = await pnMarket.marketItemList(
                (await pnMarket.marketItemCounter()) - 1
            );
        });

        it("Require : call correct item id", async () => {
            await expect(
                pnMarket.connect(addr3).cancelMarketItemForAuction(_item.id + 1)
            ).to.be.revertedWith("PNMarket: Invalid item Id");
        });

        it("Require : call sold item", async () => {
            await pnMarket
                .connect(addr2)
                .bidMarketItemForAuction(_item.id, { value: higherPrice });

            await ethers.provider.send("evm_increaseTime", [10 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine");

            await pnMarket.connect(addr3).endMarketItemForAuction(_item.id);

            await expect(
                pnMarket.connect(addr3).cancelMarketItemForAuction(_item.id)
            ).to.be.revertedWith("PNMarket: Item already sold");
        });

        it("Require : call uncancelled item", async () => {
            await ethers.provider.send("evm_increaseTime", [10 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine");

            await pnMarket.connect(addr3).cancelMarketItemForAuction(_item.id);

            await expect(
                pnMarket.connect(addr3).cancelMarketItemForAuction(_item.id)
            ).to.be.revertedWith(
                "PNMarket: Item already cancelled on the market"
            );
        });

        it("Require : cancel no bid existing auction", async () => {
            await pnMarket
                .connect(addr2)
                .bidMarketItemForAuction(_item.id, { value: higherPrice });

            await ethers.provider.send("evm_increaseTime", [10 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine");

            await expect(
                pnMarket.connect(addr3).cancelMarketItemForAuction(_item.id)
            ).to.be.revertedWith(
                "PNMarket: Cannot cancel for bid existing auctions"
            );
        });

        it("Run : token transferred", async () => {
            await ethers.provider.send("evm_increaseTime", [10 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine");

            await pnMarket.connect(addr3).cancelMarketItemForAuction(_item.id);

            _item = await pnMarket.marketItemList(
                (await pnMarket.marketItemCounter()) - 1
            );
            expect(await nftToken.ownerOf(_item.tokenId)).to.be.equal(
                addr1.address
            );
        });

        it("Run : update auction info", async () => {
            await ethers.provider.send("evm_increaseTime", [10 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine");

            await pnMarket.connect(addr3).cancelMarketItemForAuction(_item.id);

            _item = await pnMarket.marketItemList(
                (await pnMarket.marketItemCounter()) - 1
            );
            expect(_item.cancelled).to.be.equal(true);
        });
    });
});
