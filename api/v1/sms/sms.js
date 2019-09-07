const credentials = {
    apiKey: '64cea67c072d74eba9f1bffd1e493a73724009495d412a88cf1ec8d63c5d7bd1',         // use your sandbox app API key for development in the test environment
    username: 'sandbox',      // use 'sandbox' for development in the test environment
};
const AfricasTalking = require('africastalking')(credentials);

// Initialize a service e.g. SMS
sms = AfricasTalking.SMS;
function sendMessage(){
    const options = {
        // Set the numbers you want to send to in international format
        to: ['+2348036182475'],
        // Set your message
        message: "I'm a lumberjack and its ok, I sleep all night and I work all day"
    }

    // That’s it, hit send and we’ll take care of the rest
    sms.send(options).then( response => {
        console.log(response);
    }).catch( error => {
        console.log(error);
    });

}

sendMessage();
