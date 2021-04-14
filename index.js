const { TransactionProcessor } = require('sawtooth-sdk/processor')

const requisitosHandler = require ('./requisitosHandler');

const VALIDATOR_URL = process.env.VALIDATOR_URL ||'tcp://localhost:4004';

const transactionProcessor = new TransactionProcessor(VALIDATOR_URL)

transactionProcessor.addHandler(new requisitosHandler());
transactionProcessor.start();

console.log(' Started Transaction Processor');