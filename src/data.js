//------------------------------------umumiy rashodlar qayerga history-----------------------
//home page dashboard boladi
// kirim chiqim sotib olingan kunlik harajatlar oylik kirim chiqimlar bir oylik to'lov turlariga oid 
//hisobotlar dashboard kunlik ish harakatlarni korsatib bouvchi oyna

//product pageda ishlanayotgan productlar boladi
//yangi product qoshilishi bilan u yerda status birinchi orindagi status boladi va u statusni ish vaqtiga qarab o'zgartirib boriladi
// oplachen qilingishi bilan bu yerdan ochib archive ga tushadi

//client mahsulot sotib olinadigan clientlar boladi
// qayerdan qancha sumlik mahsulot sotib olgan bolsa chek qog'ozlari bilan kiritib qoyishi kerak 
//aytaylik qaysidir brenddan mdf yoki dsp sotib oldi sotib olgan mahsulotlarini umumiy kiritib chiqadi
//qancha sumlik bolgan bolsa qarzlarga qoshib qoyadi va chek qog'ozlar tarixni saqlab boradi

// -----------------bu narsani ertaga sorayman------------------
//warehouse skladdagi mahusulotlar va umumiy summa boladi
//hozirgi kunda bor bolgan mdf va boshqa mahsulotlarni korsatib turishi kerak
//bu malumotlarni har hafta dushanba kuni yangilab turishi kerak 

//users qo'ngiroq qilayotgan userlar 
//kim bilandir gaplashsa isminii va u haqidagi malumotlarni qaysi mebelga qiziqayotganini kiritib boradi va qayta qong'iroq qilishi uchun 
//malumotlarni saqlab oladi

//archive sotib olingan sotilgan har bir harakatni archivesi
//sotib olingan mahsulotlarni alohida sotilgan mahuslotlarni alohida kuniga qarab objectga saqlab olib uni uiga chiqarib berishi kerak 


//ishchilar va oylik ish haqqi: qo'lda kiritib chiqiladi va hammasini hisob kitoblarini qolda yozib chiqadi







//----------------------search tizimi---------------
//client va users da raqamga va ismga qarab search qilish kerak

//warehouse va products da nomiga qarab search qilish kerak,

// --------------------edit page ------------------
//hammasini modalda edit qilish kerak

//--------------product status ------------------------

//1- qabul qilindi ,
//2- yig'ilmoqda,
//3- yetkazilmoqda
//4-o'rnatilmoqda,
//5-To'landi

//status to'landi ga o'tishi bilanoq shu ish yakunlanishi kerak, va product pagedan o'chirib yuborish kerak
// product qoshish moduli ichida qabul qilingan avans va qoldiq summani kiritish kerak


//-----------------------------dashboard---------------------

//status => all price , all product, all clients, all users,
// status 2 => all panding money, all increment money, all decrement money, sklad money,
//status 3=> 

//kunlik qilinayotgan ishlar













//----------------------- home page chart chizish kerak  va routdan kelgan calculatelarni olib kelishim kerak

// ----------------------- firma pageda one firmaga update qilishda summa berib yuboraman

// client pageda update vaqtida qancha summalik mahsulot harid qilinganini korsatib boraman

// worker  ichida summa : input value va pay boolean  holda update qilaman va price - summani ayrib update qilaman

//lead create qilish boldi update qilib qoysam bo'ldi

// archive bitdi
//product bitdi
//login bitdi


// har bir catch va status 401 404 larga telegram bot uchun message yuborib turishi kerak







// 'use strict'

// import { app, protocol, BrowserWindow, ipcMain, globalShortcut } from 'electron'
// import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
// const isDevelopment = process.env.NODE_ENV !== 'production'

// let mainWindow
// const gotTheLock = app.requestSingleInstanceLock();

// if (!gotTheLock) {
//   app.quit();
// } else {
//   protocol.registerSchemesAsPrivileged([
//     { scheme: 'app', privileges: { secure: true, standard: true } }
//   ])

//   app.on('ready', async () => {
//     if (isDevelopment && !process.env.IS_TEST) {
//       try {
//         await installExtension(VUEJS_DEVTOOLS)
//       } catch (e) {
//         console.error('Vue Devtools failed to install:', e.toString())
//       }
//     }
//     if (!isDevelopment) launchAtStartup();
//     await createWindow()
//     mainWindow.setFullScreen(true) 
//     mainWindow.setApplicationMenu(null) 

//     mainWindow.on('close', (event) => {
//       event.preventDefault(); 
//       mainWindow.hide();
//     });

//     mainWindow.on('restore', () => {
//       mainWindow.setFullScreen(true)
//     })
//   })
// }

// async function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 1920,
//     height: 1080,
//     x: 0, y: 0,
//     frame: true, // Tugmalar ko'rinishi uchun frame true bo'lishi kerak
//     fullscreen: true, // Ilova to'liq ekran holatida bo'ladi
//     webPreferences: {
//       nodeIntegration: true,
//       enableRemoteModule: false,
//       contextIsolation: false,
//       webSecurity: false
//     }
//   })

//   // URL ni yuklash
//   if (process.env.WEBPACK_DEV_SERVER_URL) {
//     await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
//     if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
//   } else {
//     createProtocol('app')
//     mainWindow.loadURL('app://./index.html')
//   }
// }

// // Ilovani avtomatik yuklatish uchun
// function launchAtStartup() {
//   app.setLoginItemSettings({
//     openAtLogin: true,
//   });
// }

// app.on('window-all-closed', () => {
//   globalShortcut.unregisterAll();
// });

// app.on('will-quit', () => {
//   globalShortcut.unregisterAll();
// });

// ipcMain.on('minimize', (ev,e) => {
//   if(e){
//     BrowserWindow.getFocusedWindow().minimize()
//   }else{
//     mainWindow.setFullScreen(false)
//   }
// })

// ipcMain.on('close', () => {
//   mainWindow.close()
// })

// ipcMain.on('reload', () => {
//   mainWindow.reload()
// })

// app.on('browser-window-focus', function () {
//   globalShortcut.register('CommandOrControl+R', () => {});
//   globalShortcut.register('Control+Shift+R', () => {});
//   globalShortcut.register('F5', () => {});
//   globalShortcut.register('F12', () => {});
//   globalShortcut.register('Control+Shift+I', () => {});
//   globalShortcut.register("Enter+Shift+1+6", () => {
//     mainWindow.webContents.openDevTools()
//   });
// });

// app.on('browser-window-blur', function () {
//   globalShortcut.unregister('CommandOrControl+R');
//   globalShortcut.unregister('Control+Shift+R');
//   globalShortcut.unregister('F5');
//   globalShortcut.unregister('F12');
//   globalShortcut.unregister("Enter+Shift+1+6");
//   globalShortcut.unregister('Control+Shift+I');
// });

// if (isDevelopment) {
//   if (process.platform === 'win32') {
//     process.on('message', (data) => {
//       if (data === 'graceful-exit') {
//         app.quit()
//       }
//     })
//   } else {
//     process.on('SIGTERM', () => {
//       app.quit()
//     })
//   }
// }



















//-------- eng ohirgi codelar


// 'use strict'

// import { app, protocol, BrowserWindow, ipcMain, globalShortcut } from 'electron'
// import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
// import { eventController } from './main/event.js'
// const isDevelopment = process.env.NODE_ENV !== 'production'

// let mainWindow
// const gotTheLock = app.requestSingleInstanceLock();

// if (!gotTheLock) {
//   app.quit();
// } else {
//   protocol.registerSchemesAsPrivileged([
//     { scheme: 'app', privileges: { secure: true, standard: true } }
//   ])

//   app.on('ready', async () => {
//     if (isDevelopment && !process.env.IS_TEST) {
//       try {
//         await installExtension(VUEJS_DEVTOOLS)
//       } catch (e) {
//         console.error('Vue Devtools failed to install:', e.toString())
//       }
//     }
//     await createWindow()
//     eventController(ipcMain)
//     mainWindow.setFullScreen(true) 
//     // mainWindow.setApplicationMenu(null) 


//     mainWindow.on('close', (event) => {
//       event.preventDefault(); 
//       mainWindow.hide();
//     });

//     mainWindow.on('restore', () => {
//       mainWindow.setFullScreen(true)
//     })
//   })
// }

// async function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 1920,
//     height: 1040,
//     frame: false,  
//     webPreferences: {
//       nodeIntegration: true,
//       enableRemoteModule: false,
//       contextIsolation: false,
//       webSecurity: false
//     }
//   })
//   mainWindow.webContents.openDevTools();
//   if (process.env.WEBPACK_DEV_SERVER_URL) {
//     await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
//     if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
//     } else {
//   createProtocol('app')
//   mainWindow.loadURL('app://./index.html')
//   }
// }

// // app.on('window-all-closed', () => {
// //   globalShortcut.unregisterAll();
// // });

// app.on('will-quit', () => {
//   globalShortcut.unregisterAll();
// });

// ipcMain.on('minimize', () => {
//   BrowserWindow.getFocusedWindow().minimize()
// })

// ipcMain.on('close', () => {
//   mainWindow.close()
// })

// ipcMain.on('reload', () => {
//   mainWindow.reload()
// })

// // app.on('browser-window-focus', function () {
// //   globalShortcut.register('CommandOrControl+R', () => {});
// //   globalShortcut.register('Control+Shift+R', () => {});
// //   globalShortcut.register('F5', () => {});
// //   globalShortcut.register('F12', () => {});
// //   globalShortcut.register('Control+Shift+I', () => {});
// // });

// // app.on('browser-window-blur', function () {
// //   globalShortcut.unregister('CommandOrControl+R');
// //   globalShortcut.unregister('Control+Shift+R');
// //   globalShortcut.unregister('F5');
// //   globalShortcut.unregister('F12');
// //   globalShortcut.unregister('Control+Shift+I');
// // });

// if (isDevelopment) {
//   if (process.platform === 'win32') {
//     process.on('message', (data) => {
//       if (data === 'graceful-exit') {
//         app.quit()
//       }
//     })
//   } else {
//     process.on('SIGTERM', () => {
//       app.quit()
//     })
//   }
// }
