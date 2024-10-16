// utils.js
const axios = require('axios');
const TOKEN = '7511185216:AAHWpzpe9GrJ1LcWuPOlfXy_TjN2B704ocY';
const CHAT_ID = '2043384301';

function sendErrorToTelegram(error) {
    const message = `
        Xato: ${error.name}\nXato xabari: ${error.message}`;
    axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: message,
    })
    .then(response => {
        console.log('Xabar yuborildi:', response.data);
    })
    .catch(err => {
        console.error('Xabar yuborishda xato:', err);
    });
}
module.exports = {
    sendErrorToTelegram,
};
