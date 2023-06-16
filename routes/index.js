var express = require('express');
var router = express.Router();
var fs = require("fs");

let fileManager = {
  read: function() {
    if (fileManager.validData()) {
      var rawdata = fs.readFileSync('MasterData.json');
      let goodData = JSON.parse(rawdata);
      MasterData = goodData;
    }
  },
  write: function() {
    let data = JSON.stringify(MasterData);
    fs.writeFileSync('MasterData.json', data);
  },
  validData: function() {
    var rawdata = fs.readFileSync('MasterData.json');
    console.log(rawdata.length);
    if (rawdata.length < 1) {
      return false;
    } else {
      return true;
    }
  }
};
let MasterData = [];
function readDataFromFile() {
  if (fileManager.validData()) {
    var rawdata = fs.readFileSync('MasterData.json');
    let goodData = JSON.parse(rawdata);
    MasterData = goodData;
  }
}
readDataFromFile();
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

router.get('/getFoods', function(req, res) {
  readDataFromFile(); 
  res.status(200).json(MasterData);
});

router.post('/addFood', function(req, res) {
  const newFood = req.body;
  MasterData.push(newFood);
  fileManager.write();
  res.status(200).json(newFood);
});

router.delete('/deleteFood/:ID', (req, res) => {
  const delID = req.params.ID;
  const pointer = GetArrayPointer(delID); 

  if (pointer === -1) {
    console.log("not found");
    return res.status(500).json({
      status: "error - no such ID"
    });
  } else {
    MasterData.splice(pointer, 1);
    fileManager.write();
    res.send('Food with ID: ' + delID + ' deleted');
  }
});
  
function GetArrayPointer(localID) {
  for (let i = 0; i < MasterData.length; i++) {
    if (localID === MasterData[i].ID) {
      return i;
    }
  }
  return -1;
}

module.exports = router;