const { dialog } = require('electron');
const fetch = require('node-fetch');

module.exports = async function checkForUpdates() {
  const updateCheckUrl = 'https://github.com/MNBI000/my-calender/releases/latest?access_token=YOUR_ACCESS_TOKEN'; // Replace with your access token

  try {
    const response = await fetch(updateCheckUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.body;
    
    handleUpdateData(responseData);
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
};

function handleUpdateData(data) {
  try {
    const { tag_name, assets } = data;

    if (tag_name && assets.length > 0) {
      const latestAsset = assets[0];
      const downloadUrl = latestAsset.browser_download_url;

      const dialogOpts = {
        type: 'info',
        buttons: ['Download Now', 'Later'],
        title: 'Application Update',
        message: 'A new version is available. Do you want to download it?',
      };

      dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) {
          // Trigger the download logic here, e.g., using electron-dl or a custom download function.
          // autoUpdater.quitAndInstall();
        }
      });
    } else {
      console.log('No updates available.');
    }
  } catch (error) {
    console.error('Error parsing update data:', error);
  }
}
