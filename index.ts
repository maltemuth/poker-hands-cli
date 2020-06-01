#!/usr/bin/env node

import { option } from "yargs";
import { cards, percentages, odds } from "@malte.muth/poker-hands";

const read = (input: string) =>
  cards(
    ...input.split("").reduce((cardStrings, character, index) => {
      if (index % 2 === 0) {
        cardStrings.push([character]);
      } else {
        cardStrings[cardStrings.length - 1] += character;
      }

      return cardStrings;
    }, [])
  );
option("board", {
  alias: "b",
  type: "string",
  default: "",
  description: "include an already-known board",
})
  .command(
    "percentages <cards>",
    "calculates hand percentages for the given cards",
    ({ positional }) =>
      positional("cards", {
        describe: "encoding of the cards on your hand",
        default: "",
        type: "string",
      }),
    ({ cards, board = "" }) => {
      console.table(percentages(read(cards), read(board)));
    }
  )
  .command(
    "odds <hand1> <hand2> [hand3] [hand4] [hand5]",
    "calculates win chances for the given hands",
    ({ positional }) =>
      positional("hand1", {
        describe: "encoding of the first hand",
        type: "string",
      })
        .positional("hand2", {
          describe: "encoding of the second hand",
          type: "string",
        })
        .positional("hand3", {
          describe: "encoding of the third hand",
          type: "string",
        })
        .positional("hand4", {
          describe: "encoding of the fourth hand",
          type: "string",
        }),
    ({ hand1, hand2, hand3, hand4, board = "" }) => {
      const hands = [hand1, hand2, hand3, hand4].filter((_) => _).map(read);

      console.table(odds(hands, read(board)));
    }
  )
  .option("board", {
    alias: "b",
    type: "string",
    description: "include an alread-known board",
  })
  .demandCommand()
  .help().argv;
