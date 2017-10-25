module.exports = {

  'database': 'mongodb://localhost:27017/arte',

    'secret': 'SUPERsecret', // change this to a hard to guess random string. it's for jwt encryption and decryption
    'userGmail': '',
    'passGmail': '',
    'jwtExpire': '72h', //set the jwtExpire in smaller period in production

  };
