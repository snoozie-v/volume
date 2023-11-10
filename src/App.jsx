import { useState, useEffect } from 'react'
import './App.css'
import Connex from '@vechain/connex'
import fetchPrice from './pages/fetchPrice';
import { ABIVeSeaGetProfile, ABIWoVGetAccountProperties } from './pages/ABI';
import filters from './pages/filters';
import nftCollections from './pages/nftCollections';
// import getImageForCollection from './pages/getImageForCollection';
import contractToAccount from './pages/contractToAccount';
import { getStartOfMonthAgo, getStartOf24HoursAgo, getStartOfPrevious7Days } from './pages/updateDates';


const connex = new Connex({
    node: 'https://mainnet.veblocks.net/', 
    network: 'main' 
})

const { startDateTime: startOfMonth, endDateTime: endOfMonth } = getStartOfMonthAgo();
const { startDateTime: start24HoursAgo, endDateTime: end24HoursAgo } = getStartOf24HoursAgo();
const { startDateTime: startPrevious7Days, endDateTime: endPrevious7Days } = getStartOfPrevious7Days();



export default function App() {
  const [transfers, setTransfers] = useState([]);
  const [walletAmounts, setWalletAmounts] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [vetCount, setVetCount] = useState(0);
  const [collectionAmt, setCollectionAmt] = useState({})
  const [marketplaceData, setMarketplaceData] = useState({})
  const [selectedRange, setSelectedRange] = useState('This Month'); // Initialize with the default range
  const [dateRange, setDateRange] = useState({}); // Store start and end dates based on the selected range
  console.log("selectedRange", selectedRange)

  function handleDateRangeChange(range) {
    setSelectedRange(range);
    let startDateTime, endDateTime;
  
    switch (range) {
      case 'Prev 30 Days':
        startDateTime = startOfMonth;
        endDateTime = endOfMonth;
        break;
      case 'Prev 24 Hrs':
        startDateTime = start24HoursAgo;
        endDateTime = end24HoursAgo;
        break;
      case 'Prev 7 Days':
        startDateTime = startPrevious7Days;
        endDateTime = endPrevious7Days;
        break;
      default:
        // Default to 'This Month' if the range is unknown
        startDateTime = startOfMonth;
        endDateTime = endOfMonth;
    }
    console.log(startDateTime, typeof startDateTime)
    // Set the date range in the state
    setDateRange({ startDateTime, endDateTime });
    

  }

  useEffect(() => {
    // Set the default date range when the component mounts
    handleDateRangeChange('Prev 24Hrs');
  }, []);  // Empty dependency array to run only once on component mount
  
  useEffect(() => {
    
    
    async function getHistoryFor() {
      try {
        let logs = []; 
        let offset = 0; 
        const batchSize = 200; 
        const {startDateTime, endDateTime} = dateRange
        const startTimeStamp = Math.floor(startDateTime.getTime() / 1000);
        const endTimeStamp = Math.floor(endDateTime.getTime()/ 1000);


        while (true) {

          const batchLogs = await connex.thor
            .filter("event", filters)
            .range({
              unit: "time",
              from: startTimeStamp,
              to: endTimeStamp
            })
            .order("desc")
            .apply(offset, batchSize);
      

          if (batchLogs.length === 0) {
            break;
          }

          logs = logs.concat(batchLogs);
          offset += batchSize;
        }
      
        // View logs
        console.log("logs", logs);
        const splitHexData = (hexData, numParts) => {
          const cleanHex = hexData.startsWith("0x")
            ? hexData.slice(2)
            : hexData;

          const chunkSize = 64; // Each part has 64 characters
          const parts = [];

          for (let i = 0; i < numParts; i++) {
            const startIndex = i * chunkSize;
            const endIndex = startIndex + chunkSize;
            const part = cleanHex.substring(startIndex, endIndex);
            parts.push(part);
          }
          return parts;
        };

        const formattedTransfers = await Promise.all(
          logs.map(async (log, index) => {
            let decodedLog = null;

            switch (log.topics[0]) {
              case "0xbb7cf2addc576d161c349efe1848029343caab038bd75e9bed6956bcf1a512de":
                // eslint-disable-next-line no-case-declarations
                const [part1, part2, part3] = splitHexData(log.data, 3);
                decodedLog = {
                  type: "BVM Purchase", // Get the user-friendly name
                  topics: log.topics,
                  data: [part1, part2, part3],
                  meta: log.meta
                };
                break;
              case "0xf206e7b297bafe2d31f147e6050538b35b5dd424b658411bd58cfccfdf7b3781":
                // eslint-disable-next-line no-case-declarations
                const [part4, part5, part6] = splitHexData(log.data, 3);

                decodedLog = {
                  type: "Vesea Purchase",
                  topics: log.topics,
                  data: [part4, part5, part6],
                  meta: log.meta
                };
                break;
              case "0x92cb176169ade86b7d5c29774fdf7c0ae8d778cacf699d69a479fae9b19681d7":
                // eslint-disable-next-line no-case-declarations
                const [part7, part8, part9, part10, part20] = splitHexData(
                  log.data,
                  5
                );
                decodedLog = {
                  type: "WOV Purchase",
                  topics: log.topics,
                  data: [part7, part8, part9, part10, part20],
                  meta: log.meta
                };

                break;

              case "0x7df4fb99994dbf47a019499d198c1ba69e18420edf1d0bc9a31cba5ffa531ef0":
                // eslint-disable-next-line no-case-declarations
                const [part11, part12, part13, part21] = splitHexData(
                  log.data,
                  4
                );

                decodedLog = {
                  type: "WOV Offer Accepted",
                  topics: log.topics,
                  data: [part11, part12, part13, part21],
                  meta: log.meta
                };

                break;

              case "0x47b97c7cbd7d3ec9d5cc511f0b698f7fe0b891454fc558e49eb656c216b44597":
                const [part14, part15, part16] = splitHexData(log.data, 3);
                decodedLog = {
                  type: "Vesea Offer Accepted",
                  topics: log.topics,
                  data: [part14, part15, part16],
                  meta: log.meta
                };

                break;
              case "0x00c8b66fc64c33296070f8ba0cf8a2cbe11064c2411e231c550ad6c3b9c1499c":
                const [part17, part18, part19] = splitHexData(log.data, 3);
                decodedLog = {
                  type: "Vesea Collection Offer Accepted",
                  topics: log.topics,
                  data: [part17, part18, part19],
                  meta: log.meta
                };

                break;

              case "0x59a66f40592e9f6c438e82187c8cdb4cf6659e31a50187c8b1346defac648135":
                  const [part22, part23] = splitHexData(log.data, 2);
                  decodedLog = {
                    type: "ExoWorlds newSale",
                    topics: log.topics,
                    data:[part22, part23],
                    meta: log.meta
                  };
                  break;
                
              case "0xb2f957e6e6ed6377e70534f97fc23756b916174a0228bf795ee7d21597c5f637":
                    const [part24] = splitHexData(log.data, 1);
                    decodedLog = {
                      type: "VPunks AuctionSuccessful",
                      topics: log.topics,
                      data: [part24],
                      meta: log.meta
                    }

                    break;
                
              default:
                    console.log("default case");
                    break;             
            }

            const getBuyer = (transfer) => {
              switch (transfer.type) {
                case "BVM Purchase":
                  return "0x" + transfer.topics[2].substring(26);
                case "Vesea Purchase":
                  return "0x" + transfer.topics[3].substring(26);
                case "WOV Purchase":
                  return "0x" + transfer.data[0].substring(24);
                case "WOV Offer Accepted":
                  return "0x" + transfer.data[1].substring(24);
                case "Vesea Offer Accepted":
                  return "0x" + transfer.data[0].substring(24);
                case "Vesea Collection Offer Accepted":
                  return "0x" + transfer.data[0].substring(24);
                case "ExoWorlds newSale":
                  return "0x" + transfer.data[0].substring(24)
                case "VPunks AuctionSuccessful":
                  return "0x" + transfer.topics[1].substring(26);
                  default:
                  return "Unknown Buyer";
              }
            };
            
            const getTokenId = (transfer) => {
              switch (transfer.type) {
                case "BVM Purchase":
                  return parseInt(transfer.data[0], 16);
                case "Vesea Purchase":
                  return parseInt(transfer.topics[2], 16);
                case "WOV Purchase":
                  return parseInt(transfer.topics[3], 16);
                case "WOV Offer Accepted":
                  return parseInt(transfer.topics[3], 16);
                case "Vesea Offer Accepted":
                  return parseInt(transfer.topics[2], 16);
                case "Vesea Collection Offer Accepted":
                  return parseInt(transfer.topics[2], 16);
                case "ExoWorlds newSale":
                  return parseInt(transfer.topics[3], 16)
                case "VPunks AuctionSuccessful":
                  return parseInt(transfer.topics[3], 16)
                  default:
                  return "Unknown Token ID";
              }
            };

            const getPrice = async (transfer) => {
              let vetAmount;

              switch (transfer.type) {
                case "BVM Purchase":
                case "Vesea Purchase":
                case "Vesea Offer Accepted":
                case "Vesea Collection Offer Accepted":
                case "ExoWorlds newSale":
                  vetAmount = parseInt(transfer.data[1], 16) / Math.pow(10, 18);
                  break;

                case "VPunks AuctionSuccessful":
                  vetAmount = parseInt(transfer.data[0], 16) / Math.pow(10, 18)
                  break;

                  case "WOV Offer Accepted":
                  if (
                    transfer.data[3] ===
                    "00000000000000000000000045429a2255e7248e57fce99e7239aed3f84b7a53"
                  ) {
                    vetAmount = parseInt(transfer.data[2], 16) / 1e18;
                  } else {
                    const type = transfer.type;
                    const value = parseInt(transfer.data[2], 16) / 1e18;
                    const amt = value / 10 ** 18;
                    const token = transfer.data[3].replace(/^0+/, "0x");
                    const blockHeight = transfer.meta.blockNumber;

                    vetAmount = await fetchPrice(blockHeight, token, amt, type);
                    transfer.vetAmount = vetAmount;
                  }
                  break;

                case "WOV Purchase":
                  if (
                    transfer.data[3] ===
                    "0000000000000000000000000000000000000000000000000000000000000000"
                  ) {
                    vetAmount =
                      parseInt(transfer.data[1], 16) / Math.pow(10, 18);
                  } else {
                    const type = transfer.type;
                    const value = parseInt(transfer.data[1], 16);
                    const amt = value / 10 ** 18;
                    const token = "0x" + transfer.data[4].substring(24);
                    const blockHeight = transfer.meta.blockNumber;

                    vetAmount = await fetchPrice(blockHeight, token, amt, type);
                    transfer.vetAmount = vetAmount;
                  }
                  break;

                default:
                  vetAmount = 0;
                  break;
              }
              const vetAmountString = vetAmount.toFixed()
              return vetAmountString + " VET";
            };

            const nftAddress = (() => {
              switch (decodedLog.type) {
                case "BVM Purchase":
                  return "0x" + log.topics[3].substring(26);
                case "Vesea Purchase":
                  return "0x" + log.topics[1].substring(26);
                case "WOV Purchase":
                  return "0x" + log.topics[2].substring(26);
                case "WOV Offer Accepted":
                  return "0x" + log.topics[2].substring(26);
                case "Vesea Offer Accepted":
                  return "0x" + log.topics[1].substring(26);
                case "Vesea Collection Offer Accepted":
                  return "0x" + log.topics[1].substring(26);
                case "ExoWorlds newSale":
                  return "0x3473c5282057D7BeDA96C1ce0FE708e890764009";
                case "VPunks AuctionSuccessful":
                  return "0xe92fddd633008c1bca6e738725d2190cd46df4a1";
                default:
                  return "Unknown NFT Address";
              }
            })();

            const buyer = getBuyer(decodedLog)

            const getProfileName = async (buyer) => {
            const wovNickName = await connex.thor
              .account("0xc7592f90A6746E5D55e4a1543b6caE6D5b11d258")
              .method(ABIWoVGetAccountProperties)
              .call(buyer)
              if(wovNickName && wovNickName.decoded[4]) {
                return wovNickName.decoded[4]
              }
            const veSeaProfile = await connex.thor
              .account("0xdaeda865296CeE66dc6863f9e93751f00B3606Fb")
              .method(ABIVeSeaGetProfile)
              .call(buyer);
              if(veSeaProfile && veSeaProfile.decoded[0][1]) {
                return veSeaProfile.decoded[0][1]
              }
              return buyer
            }

            const profileName = await getProfileName(buyer)
            decodedLog.buyer = profileName
            
            const tokenId = getTokenId(decodedLog);
            const price = await getPrice(decodedLog);
            
            const collectionName = await nftCollections.find((collection) => collection.nftAddress.toLowerCase() === nftAddress.toLowerCase()) 
            decodedLog.collection = collectionName ? collectionName.title : (() => {
              console.log(nftAddress);
              return nftAddress;
            })();

            decodedLog.nftAddress = nftAddress
            decodedLog.price = price;
            decodedLog.tokenId = tokenId;
            decodedLog.number = index + 1;
            const account = contractToAccount(nftAddress);
            decodedLog.account = account
            // decodedLog.image = await getImageForCollection(account, tokenId);
            return decodedLog;
          })
        );
        console.log("formatted transfers", formattedTransfers)
        setTransfers(formattedTransfers);


        const amounts = {};
        const quantities = {};
        const collectionAmounts = {};
        const marketplaceAmounts = {}

        let totalCount = 0;
        let vetCount = 0;
        for (const transfer of formattedTransfers) {
          const transferType = transfer.type;
          if (marketplaceAmounts[transferType]) {
            marketplaceAmounts[transferType] += parseFloat(transfer.price)
          } else {
            marketplaceAmounts[transferType] = parseFloat(transfer.price)
          }
        }

        const transferTypeAmountsArray = Object.entries(marketplaceAmounts)
   

        const consolidatedMarketplaces = {
          'VeSea': 0,
          'WOV': 0,
          'BVM': 0,
          'Exo': 0,
          'VPunks': 0,
        };
        
        // Iterate through the marketplaceAmountsArray and consolidate the amounts
        for (const [marketplaceType, amount] of transferTypeAmountsArray) {
          switch (marketplaceType) {
            case 'Vesea Purchase':
            case 'Vesea Offer Accepted':
            case 'Vesea Collection Offer Accepted':
              consolidatedMarketplaces['VeSea'] += amount;
              break;
            case 'WOV Purchase':
            case 'WOV Offer Accepted':
              consolidatedMarketplaces['WOV'] += amount;
              break;
            case 'BVM Purchase':
              consolidatedMarketplaces['BVM'] += amount;
              break;
            case 'ExoWorlds newSale':
              consolidatedMarketplaces['Exo'] += amount;
              break;
            case 'VPunks AuctionSuccessful':
              consolidatedMarketplaces['VPunks'] += amount;
              break;
            default:
              consolidatedMarketplaces['Other'] += amount;
              break;
          }
        }
        const marketplaces = Object.entries(consolidatedMarketplaces)
        marketplaces.sort((a, b) => b[1] - a[1])
        

        for (const transfer of formattedTransfers) {
          const collectionName = transfer.collection;

          if (collectionAmounts[collectionName]) {
            collectionAmounts[collectionName] += parseFloat(transfer.price);
          } else {
            collectionAmounts[collectionName] = parseFloat(transfer.price);
          }
        }


        const collectionAmountsArray = Object.entries(collectionAmounts);
        collectionAmountsArray.sort((a, b) => b[1] - a[1]);

        const topCollections = collectionAmountsArray.slice(0, 5);


        for (const transfer of formattedTransfers) {
          const wallet = transfer.buyer;
       
          
          if (quantities[wallet]) {
            quantities[wallet]++;
          } else {
            quantities[wallet] = 1;
          }

          if (amounts[wallet]) {
            amounts[wallet] += parseFloat(transfer.price);
          } else {
            amounts[wallet] = parseFloat(transfer.price);
          }

          totalCount++;
          vetCount += parseFloat(transfer.price);
        }

        const avgPurchasePrices = {};
        for (const wallet in amounts) {
          avgPurchasePrices[wallet] = amounts[wallet] / quantities[wallet];
        }

        const amountsArray = Object.entries(amounts);
        amountsArray.sort((a, b) => b[1] - a[1]);
        const top5Collector = amountsArray.slice(0, 5)
        const sortedAmounts = Object.fromEntries(top5Collector);
        

        setMarketplaceData(marketplaces)
        setWalletAmounts(sortedAmounts);
        setTotalCount(totalCount);
        setVetCount(vetCount);
        setCollectionAmt(topCollections)
        
      } catch (err) {
        console.error(err);
      }
    }

    getHistoryFor();
  }, [dateRange]);

  return (
    <>
 
    <div className='navBar'>
      <div className='home'><a href="https://www.non-fungiblenews.com/">Home</a></div>
      <div className='sales'><a href="https://volume-mauve.vercel.app/">Sales-Today</a></div>
    </div>

    <h1>vechain sales history</h1>
      <div className='selector-group'>
      <div className='selector' onClick={() => handleDateRangeChange('Prev 24 Hrs')} ><span>Prev 24Hrs</span></div>
      <div className='selector' onClick={() => handleDateRangeChange('Prev 7 Days')}><span>Prev Week</span></div>
      <div className='selector' onClick={() => handleDateRangeChange('Prev 30 Days')}><span>Prev Month</span></div>
      </div>
      <div className='wrapper'>
      
      <div className='times item'>
        <p>Range: {selectedRange}</p>
        {/* <p>End: {endDateTimeString}</p> */}

          <p>Count: {totalCount}</p> 
          <p>Total: {vetCount} $VET</p>
        </div>

        <div className='marketplaces item'>
          <h2>Marketplaces</h2>
          <ul style={{listStyleType:"none"}}>
              {Object.entries(marketplaceData).map(([mp, count], index) => (
                <li key={mp}>
                  <p className={index === 0 ? 'bold-text' : ''}>
                    {count[0]} - {count[1]} $VET
                  </p>
                </li>
              ))}
          </ul>
        </div>


        <div className='collectors item'>
          <h2>Top 5 Collectors</h2>
          <ul style={{listStyleType:"none"}}>
              {Object.entries(walletAmounts).map(([wallet, count], index) =>(
                <li key={wallet}>
                  <p className={index === 0 ? 'bold-text' : ''}>
                  {wallet} - {count} $VET
                  </p>
                </li>
              ))}
          </ul>
        </div>
        <div className='collections item'>
          <h2>Top 5 Collections</h2>
          <ul style={{listStyleType:"none"}}>
              {Object.entries(collectionAmt).map(([collection, count], index) => (
                <li key={collection}>
                  <p className={index === 0 ? 'bold-text' : ''}>
                    {count[0]} - {count[1]} $VET
                  </p>
                </li>
              ))}
          </ul>
        </div>      
      </div>
          <h3 className='transfer-title'>transfers:</h3>
          <div className='transfers'>
      <ul className='transfers-list' style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {transfers && transfers.length > 0 ? (
          transfers.map((transfer, index) => (
            <li
              key={index}
              className='transfers-item'
              style={{
                border: "1px solid white",
                display: "block",
                borderRadius: "3%",
                width: "350px",
                boxShadow: "inset -5px -5px 10px rgba(0, 0, 0, 0.5)",
              }}
            >
              <p>buyer: {transfer.buyer}</p>
              <p>price: {transfer.price}</p>
              <p>collection: {transfer.collection}</p>
              <p>tokenID: {transfer.tokenId}</p>
              <p>type: {transfer.type}</p>
              <p>
                time:{" "}
                {new Date(transfer.meta.blockTimestamp * 1000).toLocaleString()}
              </p>
              <p>count: {transfer.number}</p>
            </li>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </ul>
    </div>
  </>
);
        }
