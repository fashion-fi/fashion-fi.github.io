// params: 1 nftId 
// return metadata of nftId
Moralis.Cloud.define("getNft", async(request) => {
    const logger = Moralis.Cloud.getLogger();
    let NFTID = request.params.nftId;
    let HEXID = parseInt(NFTID).toString(16);
    let PaddingHex= ("0000000000000000000000000000000000000000000000000000000000000000"+HEXID).slice(-64);
    logger.info(PaddingHex);
    return Moralis.Cloud.httpRequest({"url":"https://ekdsp71yq7nf.usemoralis.com/"+PaddingHex+".json"}).then(function(httpResponse){
      logger.info("httpResponse:"+httpResponse);
      return httpResponse.text;});
  })