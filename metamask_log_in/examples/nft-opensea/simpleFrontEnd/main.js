//Moralis.initialize("jGZckKEocZO4b9SIXh2Q6U7k4NK8lG1ucKITJPk1"); // Application id from moralis.io
//Moralis.serverURL = "https://ekdsp71yq7nf.usemoralis.com:2053/server"; //Server url from moralis.io

Moralis.start({
  //get them from moralis
  serverUrl: 'https://ekdsp71yq7nf.usemoralis.com:2053/server',
  appId: 'jGZckKEocZO4b9SIXh2Q6U7k4NK8lG1ucKITJPk1',
})
// get it from opensea
CONTACTID = '0xf4aa316c1058cafa8910b39d98ffdd67b782619f'
async function initializeApp() {
  try {
    currentUser = Moralis.User.current()
    if (!currentUser) {
      currentUser = await Moralis.Web3.authenticate()
    }
    const options = {
      address: CONTACTID,
      chain: 'rinkeby',
    }
    let NFTS = await Moralis.Web3API.token.getAllTokenIds(options)
    let metaData = await fetchData(NFTS.result);
    let userData = await getOwnerData();
    renderCard(metaData,userData)
  } catch (error) {
    console.log(error)
  }
}

function renderCard(NFTS,userData) {
  const root = document.getElementById('app')
  for (let i = 0; i < NFTS.length; ++i) {
    const nft = NFTS[i]
    let htmlStr = `<div class="card" style="width: 18rem;">
        <img class="card-img-top" src="${nft.metadata.image}" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">${nft.metadata.name}</h5>
          <p class="card-text">${nft.metadata.description}</p>
          <p class="card-text">"Amount "+${nft.amount}</p>
          <p class="card-text">"Your Balance "+${userData[nft.token_id]}</p>
          <p class="card-text">"Owners "+${nft.owners.length}</p>
          <a href="/mint.html?nftId=${nft.token_id}" class="btn btn-primary">Mint</a>
          <a href="/transfer.html?nftId=${nft.token_id}" class="btn btn-primary">Transfer</a>
        </div>
      </div>"`
    let col = document.createElement('div')
    col.className = 'col col-md-3 col-lg-6'
    col.innerHTML = htmlStr
    root.appendChild(col)
  }
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getOwnerData(){
  currentUser = Moralis.User.current()
  let accounts = currentUser.get("accounts");
  const options = {
    address: accounts,
    chain: 'rinkeby',
    token_address:CONTACTID,
  }
  return Moralis.Web3API.account.getNFTsForContract(options).then((data)=>{
    let result = data.result.reduce((object, currElemenet)=>{
      object[currElemenet.token_id] = currElemenet.amount;
      return object;
    },{})
    return result;
  });
}
async function fetchData(NFTS) {
  let promises = []
  for (let i = 0; i < NFTS.length; ++i) {
    let nft = NFTS[i]
    let id = nft.token_id
    //call moralis cloud function
    promises.push(
      fetch(
        'https://ekdsp71yq7nf.usemoralis.com:2053/server/functions/getNft?_ApplicationId=jGZckKEocZO4b9SIXh2Q6U7k4NK8lG1ucKITJPk1&nftId=' +
          id,
      )
        .then((res) => res.json())
        .then((res) => JSON.parse(res.result))
        .then((res) => {
          nft.metadata = res
        })
        .then((res) => {
          sleep(2000)
          const options = {
            address: CONTACTID,
            chain: 'rinkeby',
            token_id: id,
          }
          return Moralis.Web3API.token.getTokenIdOwners(options);          
        })
        .then((res) => {
         nft.owners = []
         res.result.forEach(element=>{
           nft.owners.push(element.ownerOf);
         });
         return nft
        }),
    )
  }
  return Promise.all(promises)
}

initializeApp()
