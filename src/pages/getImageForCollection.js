import tokenURIAbi from "./tokenURIAbi";
import mutants from "../assets/mutants.png"

async function getImageForCollection(account, tokenId) {
    let nftURI,
      URIOutput,
      metadataResponse,
      metadata,
      imageUrl,
      presentImage,
      presentImageURL;
      console.log("account + token", account.address, tokenId)
    switch (account.address) {
        
      case "0xf4d82631be350c37d92ee816c2bd4d5adf9e6493": // mino mob og
        nftURI = account.method(tokenURIAbi);
        URIOutput = await nftURI.call(tokenId);
  
        metadataResponse = await fetch(
          `https://arweave.net/${URIOutput.decoded[0].substr(5)}`
        );
  
        metadata = await metadataResponse.json();
  
        imageUrl = metadata.image;
        presentImage = await fetch(`https://arweave.net/${imageUrl.substr(5)}`);
        presentImageURL = presentImage.url;
  
        return presentImageURL;
  
      case "0x523bef286ac6b08eb1a9db765970852b086903fa": // mino mob mutants
        // nftURI = account.method(tokenURIAbi);
        // URIOutput = await nftURI.call(tokenId);
  
        // metadataResponse = await fetch(
        //   `https://ipfs.io/ipfs/${URIOutput.decoded[0].substr(7)}`
        // );
        // metadata = await metadataResponse.json();
        // imageUrl = metadata.image;
        // presentImage = await fetch(`https://ipfs.io/ipfs/${imageUrl.substr(7)}`);
        // presentImageURL = presentImage.url;
        presentImageURL = mutants;
        return presentImageURL;
  
      case "0xc766ddd21f14862ef426f15bfb28573fdad8bc51": // Mino Mob Multiverse
        nftURI = account.method(tokenURIAbi);
        URIOutput = await nftURI.call(tokenId);
  
        metadataResponse = await fetch(
          `https://arweave.net/${URIOutput.decoded[0].substr(5)}`
        );
  
        metadata = await metadataResponse.json();
  
        imageUrl = metadata.image;
        presentImage = await fetch(`https://arweave.net/${imageUrl.substr(5)}`);
        presentImageURL = presentImage.url;
  
        return presentImageURL;
  
      case "0x862b1cb1c75ca2e2529110a9d43564bd5cd83828": // Mino Mob Elixir
        nftURI = account.method(tokenURIAbi);
        URIOutput = await nftURI.call(tokenId);
  
        metadataResponse = await fetch(
          `https://arweave.net/${URIOutput.decoded[0].substr(5)}`
        );
  
        metadata = await metadataResponse.json();
  
        imageUrl = metadata.animation_url;
        presentImage = await fetch(`https://arweave.net/${imageUrl.substr(5)}`);
        presentImageURL = presentImage.url;
  
        return presentImageURL;
        
    case "0x4786bfd13641507b4cd8b492c362c13bcf35ee71": // Ratverse
        nftURI = account.method(tokenURIAbi);
        URIOutput = await nftURI.call(tokenId)

  
        metadataResponse = await fetch(
          `https://ipfs.io/ipfs/${URIOutput.decoded[0].substr(7)}`
        );
        console.log(metadataResponse)
        
        metadata = await metadataResponse.json();
        imageUrl = metadata.image;
        console.log(imageUrl)
        presentImage = await fetch(`https://ipfs.io/ipfs/${imageUrl.substr(7)}`);
        presentImageURL = presentImage.url;
        console.log(presentImageURL)
        return presentImageURL
      default:
        return "Default Image URL";
    }
  }

  export default getImageForCollection;