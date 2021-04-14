const { TransactionHandler } = require('sawtooth-sdk/processor/handler')

const crypto  = require('crypto');
const { resolve } = require('path');

const TP_FAMILY = 'requisitos';
const TP_NAMESPACE = '010101';
const TP_VERSION = '1.0';
const ATOR = '99';

class RequisitosTransactionHandler extends TransactionHandler {
    constructor(){
        super(TP_FAMILY, [TP_VERSION], [TP_NAMESPACE])
    }
    apply(transaction, context){
        return new Promise((resolve, reject) => {

        })
    }
}
module.exports = RequisitosTransactionHandler;