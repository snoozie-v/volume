import Connex from "@vechain/connex"

const connex = new Connex({
    node: 'https://mainnet.veblocks.net/', 
    network: 'main' 
})

const contractToAccount = (nftAddress) => {
    return connex.thor.account(nftAddress)
  };

  export default contractToAccount