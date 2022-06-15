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
    //check user login in or not
    currentUser = Moralis.User.current()
    if (!currentUser) {
      window.location.pathname = '/index.html'
    }
    const urlParams = new URLSearchParams(window.location.search)
    const nftId = urlParams.get('nftId')
    const options = {      
      address: CONTACTID,
      //because I put it in rinkeby virtual network
      chain: 'rinkeby',
    }
    document.getElementById('tokenID').value = nftId

    //we need support web3 then we can do mint
    web3 = await Moralis.enableWeb3()
    const accounts = await Moralis.account
    document.getElementById('address').value = accounts
  } catch (error) {
    console.log(error)
  }
}

async function mint() {
  
  let tokenId = parseInt(document.getElementById('tokenID').value)
  let address = document.getElementById('address').value
  let amount = parseInt(document.getElementById('amount').value)

  //mint contract code from moralis document
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const accounts = await Moralis.account
  
  const contract = new ethers.Contract(CONTACTID, contractAbi,signer)
  console.log(tokenId)
  contract.mint(address, tokenId, amount);
}

document.getElementById('mintSubmit').onclick = mint
initializeApp()
