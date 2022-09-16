const fs = require("fs");
const width = 1000;
const height = 1000;
const dir = __dirname;
const description = "This is an NFT made by the coolest generative code.";
const baseImageUri = "https://hashlips/nft";
const startEditionFrom = 0;
const endEditionAt = 1000;
const editionSize = 1000;
const raceWeights = [
  {
    value: "skull",
    from: 0,
    to: editionSize,
  },
];

const races = {
  skull: {
    name: "Skull",
    layers: [
      {
        name: "Background",
        elements: [
          {
            id: 0,
            name: "1",
            path: `${dir}/background/1.png`,
            weight: 100,
          },
          {
            id: 1,
            name: "2",
            path: `${dir}/background/2.png`,
            weight: 90,
          },
          {
            id: 2,
            name: "3",
            path: `${dir}/background/3.png`,
            weight: 80,
          },
          {
            id: 3,
            name: "4",
            path: `${dir}/background/4.png`,
            weight: 70,
          },
          {
            id: 4,
            name: "5",
            path: `${dir}/background/5.png`,
            weight: 60,
          },
          // {
          //   id: 5,
          //   name: "6",
          //   path: `${dir}/background/6.png`,
          //   weight: 50,
          // },
          // {
          //   id: 6,
          //   name: "7",
          //   path: `${dir}/background/7.png`,
          //   weight: 40,
          // },
          // {
          //   id: 7,
          //   name: "8",
          //   path: `${dir}/background/8.png`,
          //   weight: 30,
          // },
          // {
          //   id: 8,
          //   name: "9",
          //   path: `${dir}/background/9.png`,
          //   weight: 20,
          // },
          // {
          //   id: 9,
          //   name: "10",
          //   path: `${dir}/background/10.png`,
          //   weight: 10,
          // },
        ],
        position: { x: 0, y: 0 },
        size: { width: width, height: height },
      },
      {
        name: "Middle",
        elements: [
          {
            id: 0,
            name: "1",
            path: `${dir}/middle/1.png`,
            weight: 100,
          },
          {
            id: 1,
            name: "2",
            path: `${dir}/middle/2.png`,
            weight: 90,
          },
          {
            id: 2,
            name: "3",
            path: `${dir}/middle/3.png`,
            weight: 80,
          },
          {
            id: 3,
            name: "4",
            path: `${dir}/middle/4.png`,
            weight: 70,
          },
          {
            id: 4,
            name: "5",
            path: `${dir}/middle/5.png`,
            weight: 60,
          },
          // {
          //   id: 5,
          //   name: "6",
          //   path: `${dir}/middle/6.png`,
          //   weight: 50,
          // },
          // {
          //   id: 6,
          //   name: "7",
          //   path: `${dir}/middle/7.png`,
          //   weight: 40,
          // },
          // {
          //   id: 7,
          //   name: "8",
          //   path: `${dir}/middle/8.png`,
          //   weight: 30,
          // },
          // {
          //   id: 8,
          //   name: "9",
          //   path: `${dir}/middle/9.png`,
          //   weight: 20,
          // },
          // {
          //   id: 9,
          //   name: "10",
          //   path: `${dir}/middle/10.png`,
          //   weight: 10,
          // },
        ],
        position: { x: 0, y: 0 },
        size: { width: width, height: height },
      },
      {
        name: "Center",
        elements: [
          {
            id: 0,
            name: "1",
            path: `${dir}/center/1.png`,
            weight: 100,
          },
          {
            id: 1,
            name: "2",
            path: `${dir}/center/2.png`,
            weight: 90,
          },
          {
            id: 2,
            name: "3",
            path: `${dir}/center/3.png`,
            weight: 80,
          },
          {
            id: 3,
            name: "4",
            path: `${dir}/center/4.png`,
            weight: 70,
          },
          {
            id: 4,
            name: "5",
            path: `${dir}/center/5.png`,
            weight: 60,
          },
          // {
          //   id: 5,
          //   name: "6",
          //   path: `${dir}/center/6.png`,
          //   weight: 50,
          // },
          // {
          //   id: 6,
          //   name: "7",
          //   path: `${dir}/center/7.png`,
          //   weight: 40,
          // },
          // {
          //   id: 7,
          //   name: "8",
          //   path: `${dir}/center/8.png`,
          //   weight: 30,
          // },
          // {
          //   id: 8,
          //   name: "9",
          //   path: `${dir}/center/9.png`,
          //   weight: 20,
          // },
          // {
          //   id: 9,
          //   name: "10",
          //   path: `${dir}/center/10.png`,
          //   weight: 10,
          // },
        ],
        position: { x: 0, y: 0 },
        size: { width: width, height: height },
      },
    ],
  },
};

module.exports = {
  width,
  height,
  description,
  baseImageUri,
  editionSize,
  startEditionFrom,
  endEditionAt,
  races,
  raceWeights,
};
