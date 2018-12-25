const level = require('level');
const chainDB = './myBlockChainData';
const db = level(chainDB);
var dbAsync = require('level-promisify')(db);
console.log("-----file loaded");
var LevelDAL = function(options) {
    _.assign(this, options);
};

LevelDAL.getBlock = function(key){  
    return new Promise((resolve, reject) => {
      db.get(key, function(err, value) {
          if (err) 
            return console.log('GET Error', err);
          resolve(JSON.parse(value));
      });
    })  
};

LevelDAL.getBlockHeight = function() {
  let blockHeight=0;
  return new Promise((resolve, reject) => {
    db.createReadStream().on('data', function(data) { 
        blockHeight = blockHeight + 1; 
    }).on('error', function(err) {
        return console.log('Unable to read data stream!', err)
    }).on("close", function () {
        resolve(blockHeight);
    });
  });
}

  // Add data to levelDB with key/value pair
  LevelDAL.addLevelDBData = function(key,newBlock){
    console.log("saving data to level db");
    console.log("Key ::" + key);
    db.put(key, newBlock, function(err) {      
      if (err) 
      return console.log('Block ' + key + ' submission failed', err);
    })
  };

   LevelDAL.addDataToLevelDB = function(newBlock) {
     console.log("-----------addDataToLevelDB");
    let i = 0;
    db.createReadStream()
    .on('data', function(data) {         
      //get the block height
      i++;
    }).on('error', function(err) {
      return console.log('Unable to read data stream!', err)
    }).on('close', function() {                    
      //newBlock.height = i;          
      console.log("Passing data to level db");
      LevelDAL.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString());
    });
  };

module.exports = LevelDAL;