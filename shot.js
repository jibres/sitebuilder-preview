/**
 * 
 * v1.0
 **/

// puppeteer to take screenshot
const puppeteer = require('puppeteer');
// fs to work with files
const fs = require('fs');
const path = require('path')



// define dist folder
const addrPreviewList = 'src/preview-list.json';
// const addrPreviewList = 'src/preview-list-test.json';
const addrPreviewURL = 'https://demo.jibres.me/preview/';


function createFolderIfNotExist(_path)
{
  try {
    if (!fs.existsSync(_path)) {
      fs.mkdirSync(_path, { recursive: true });
    }
  } catch (err) {
    console.error(err);
  }
}


async function takeScreenShot(_url, _save)
{
  var saveFolder = path.dirname(_save);
  createFolderIfNotExist(saveFolder);

  // try to get scrrenshot
  await (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    const response = await page.goto(_url, {
      waitUntil: 'networkidle0',
    });

    if(response.status() === 200)
    {
      // it's okay
    }
    else
    {
      // show error in red message
      console.error('\x1b[41m', '\tFailed! Header Status ' + response.status(), '\x1b[40m');
    }

    // take png screenshot
    // await page.screenshot({ path: _save, format: 'png'});

    // take webp screenshot
    await page.screenshot({ path: _save, format: 'webp'});

    await browser.close();

  })();
}


async function readAndShot()
{
  // read file data
  const fileData = fs.readFileSync(addrPreviewList);
  // parse as json
  const json = JSON.parse(fileData.toString());

  // console.log(json);
  // sample json
  // {
  //   header: { h0: [ 'p1' ], h3: [ 'p1' ] },
  //   blog: { b4: [ 'p1', 'p4' ] }
  // }

  // loop for each group
  for(var groupName in json)
  {
    var groupArr = json[groupName];

    // sample groupName
    // header
    // sample groupArr
    // { h0: [ 'p1', 'p2' ], h3: [ 'p1' ] }

    // loop for each model
    for(var modelName in groupArr)
    {
      var previewArr =  groupArr[modelName];

      // sample modelName
      // h0
      // sample previewArr
      // [ 'p1', 'p2' ]

      for(var previewList in previewArr)
      {
        var previewName = previewArr[previewList];
        var targetPreviewUrl = addrPreviewURL + groupName + '/' + modelName + '/' + previewName + '?lock=1';
        var targetPreviewFileName = 'pack/' + groupName + '/' + modelName + '/' + modelName + "-" + previewName + '.webp';
        
        // show in console
        console.log(targetPreviewUrl + "\t>>\t" + targetPreviewFileName);
        // do one by one
        await takeScreenShot(targetPreviewUrl, targetPreviewFileName);
      }
    }
  }
}


// read json file to create path list
readAndShot();
