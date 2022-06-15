Moralis.start({
  //get them from moralis
  serverUrl: 'https://ekdsp71yq7nf.usemoralis.com:2053/server',
  appId: 'jGZckKEocZO4b9SIXh2Q6U7k4NK8lG1ucKITJPk1',
})
// get it from opensea
CONTACTID = '0xf4aa316c1058cafa8910b39d98ffdd67b782619f'

let web3
const ethers = Moralis.web3Library

async function initializeApp() {
  try {
    currentUser = Moralis.User.current()
    if (!currentUser) {
      window.location.pathname = '/index.html'
    }
    const urlParams = new URLSearchParams(window.location.search)
    const nftId = urlParams.get('nftId')
    const options = {
      address: CONTACTID,
      chain: 'rinkeby',
    }
    document.getElementById('tokenID').value = nftId
    web3 = await Moralis.enableWeb3()
  } catch (error) {
    console.log(error)
  }
}

async function transfer() {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  let tokenId = parseInt(document.getElementById('tokenID').value)
  let address = document.getElementById('address').value
  let amount = parseInt(document.getElementById('amount').value)
  console.log(tokenId)

  //transfer nft code from moralis document
  const options = {
    type: "erc1155",
    receiver: address,
    contractAddress: CONTACTID,
    tokenId: tokenId,
    amount: amount,
  };
  let transaction = await Moralis.transfer(options);
  console.log(transaction)
}

document.getElementById('transferSubmit').onclick = transfer
initializeApp()
