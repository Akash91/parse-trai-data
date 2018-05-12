var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var sampleJsonObj = {
  'link': 'actual link',
  'linkText': 'column text',
  'email': 'some@email.com',
  'dateCol': 'somedate',
  'subject': '',
  'from': '',
  'date': 'actual time stamp',
  'to': 'to email',
  'emailContent': 'lots of content'
};

var listOfLinks = [
  '/27%20March%20to%2010%20April%20OTT.mbox.html',
  '/12%20April%20Part%20B.htm',
  '/13th%20Apr%20ott-1.htm',
  '/14_APR.htm',
  '/14_APR_I.htm',
  '/14_APR_K.htm',
  '/15th%20April%20OTT.htm',
  '/16_April_OTT_Part_2.htm',
  '/16_April_Part_3.htm',
  '/17%20April%20OTT.htm',
  '/18%20April%20OTT.mbox.html',
  '/19%20April%20OTT.mbox.html',
  '/20%20April.mbox.html',
  '/21%20april.htm',
  '/22_apr.htm',
  '/23%20April.htm',
  '/24%20April.htm',
]

listOfLinks.forEach(function(link){
  request(link, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var arr = [];
      $('tr').each(function(){
        var colOne = $(this).find('td');
        var link = colOne.find('a').attr('href');
        link = link || '';
        link = link.trim();
        var linkText = colOne.find('a').text().trim();
        var colTwo = colOne.next().eq(0);
        var email = colTwo.text().trim();
        email = email.replace(/\(at\)/g,'@');
        email = email.replace(/\(dot\)/g,'.');
        var dateCol = colTwo.next().next().text();
        // if (link && link !== '') {
        //   request(link, function (nestedError, nestedResponse, nestedHtml) {
        //     console.log('++++++++++++++++++++', link, '++++++++++++++++++++');
        //     if (!nestedError && nestedResponse.statusCode == 200) {
        //       console.log(nestedHtml);
        //     }
        //   });
        // }
        var tempJsonObj = {
          'link': link,
          'linkText': linkText,
          'email': email,
          'dateCol': dateCol
        };
        arr.push(tempJsonObj);
      });
      var today = new Date();
      today = today.toTimeString();
      fs.writeFileSync('email'+today+'.json', JSON.stringify(arr));
    }
  });
});