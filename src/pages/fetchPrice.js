async function fetchPrice(blockHeight, token, amt, type) {
    const response = await fetch("https://api.vechain.energy/v1/call/main", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        revision: blockHeight,
        clauses: [
          {
            to: "0x576da7124c7bb65a692d95848276367e5a844d95",
            abi: {
              name: "getAmountsOut",
              inputs: [
                {
                  internalType: "uint256",
                  name: "amountIn",
                  type: "uint256"
                },
                {
                  internalType: "address[]",
                  name: "path",
                  type: "address[]"
                }
              ],
              outputs: [
                {
                  internalType: "uint256[]",
                  name: "amounts",
                  type: "uint256[]"
                }
              ],
              type: "function"
            },
            args: [
              "1000000000000000000",
              [
                token,
                "0x45429A2255e7248e57fce99E7239aED3f84B7a53",
                "0x4E17357053dA4b473e2daa2c65C2c949545724b8"
              ]
            ]
          }
        ]
      })
    });
  
    const data = await response.json();
    console.log(token, amt, data)
    const numData = parseFloat(data[1]);
    console.log(numData)
    const firstAmount = (numData * amt).toString();
    console.log(firstAmount)
    if (type === "WOV Offer Accepted") {
      const vetAmount = Math.floor(firstAmount);
      console.log(vetAmount)
      return vetAmount;
    } else if (type === "WOV Purchase") {
      const vetAmount = Math.floor(firstAmount / 1e18);
      console.log(vetAmount)
      return vetAmount;
    }
  }

  export default fetchPrice