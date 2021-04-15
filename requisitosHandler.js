const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')
const {crypto}  = require('crypto');
const { resolve } = require('path');


const{TP_FAMILY, TP_NAMESPACE, TP_VERSION} = require("./env")



const hash = (input) => crypto.createHash('sha512').update(input).digest('hex').toLowerCase()




class RequisitosTransactionHandler extends TransactionHandler {
    constructor(){
        super(TP_FAMILY, [TP_VERSION], [TP_NAMESPACE])
    }
    apply(transaction, context){
        return context.setState({
            [address]: Buffer.from(JSON.stringify({sampleValueState: 'value'}))
        }).then(addresses=>{
            if(addresses.length === 0){
                throw InvalidTransaction('Aqui aconteceu algo!')
            }
        }).catch(error=>{
            throw InvalidTransaction(error.message);
        }) 
    }
}
module.exports = RequisitosTransactionHandler;