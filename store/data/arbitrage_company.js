import { createCRUD } from "~/plugins/crud";

const crudModule = createCRUD({
  resource: "platform/arbitrage_company",
  state: {
    currencies: {
      "binance": ["ETH", "BTC", "XRP", "LUNA", "BCH"],
      "kraken": ["DOT", "ADA", "SOL", "LUNA", "TRX"],
      "gate": ["ETH", "BTC", "XRP", "LUNA", "BCH"],
      "kucoin": ["ETH", "BTC", "XRP", "LUNA", "BCH"],
      "bybit": ["ETH", "BTC", "XRP", "DOT", "EOS"],
    }
  },
  getters: {
    currencies(state) {
      return state.currencies
    },
  
  }
});

const state = () => crudModule.state;
const { actions, mutations, getters } = crudModule;

export { state, actions, mutations, getters };
