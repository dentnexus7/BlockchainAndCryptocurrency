const PubNub = require('./pubnub');

const credentials = {
    publishKey: 'pub-c-4c489307-8d76-433a-bb0d-c60f6db26f80',
    subscribeKey: 'sub-c-1ba5a586-2dfc-11ec-9ccf-0aac42b27a06',
    secretKey: 'sec-c-YTg3YjU0ZjMtY2NjZi00NDcwLTk4N2UtODBjMTViOGJiNWFi'
}

const CHANNELS = {
    TEST: 'TEST',
    TESTTWO: 'TESTTWO',
    BLOCKCHAIN: 'BLOCKCHAIN'
}

class PubSub {
    constructor() {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;

        this.pubnub = new PubNub(credentials);

        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

        this.pubnub.addListener(this.listener());
    }

    broadcastChain() {
        this.publish({
          channel: CHANNELS.BLOCKCHAIN,
          message: JSON.stringify(this.blockchain.chain)
        });
    }
    
      broadcastTransaction(transaction) {
        this.publish({
          channel: CHANNELS.TRANSACTION,
          message: JSON.stringify(transaction)
        });
    }
    
      subscribeToChannels() {
        this.pubnub.subscribe({
          channels: [Object.values(CHANNELS)]
        });
    }

    listener() {
        return {
          message: messageObject => {
            const { channel, message } = messageObject;
    
            console.log(`Message received. Channel: ${channel}. Message: ${message}`);
            const parsedMessage = JSON.parse(message);
    
            switch(channel) {
              case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage, true, () => {
                  this.transactionPool.clearBlockchainTransactions(
                    { chain: parsedMessage.chain }
                  );
                });
                break;
              case CHANNELS.TRANSACTION:
                if (!this.transactionPool.existingTransaction({
                  inputAddress: this.wallet.publicKey
                })) {
                  this.transactionPool.setTransaction(parsedMessage);
                }
                break;
              default:
                return;
            }
          }
        }
      }

    publish({ channel, message }) {
        this.pubnub.publish({ channel, message });
    }

    broadcastChain() {
        this.publish({
          channel: CHANNELS.BLOCKCHAIN,
          message: JSON.stringify(this.blockchain.chain)
        });
    }
    
      broadcastTransaction(transaction) {
        this.publish({
          channel: CHANNELS.TRANSACTION,
          message: JSON.stringify(transaction)
        });
    }
}

module.exports = PubSub;