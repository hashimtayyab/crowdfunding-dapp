import './App.css';
import React, { useState } from "react";
import { Crowdfund } from "./abi/abi";
import Web3 from "web3";

const web3 = new Web3(Web3.givenProvider);
// Contract address of the deployed smart contract
const contractAddress = "0x89Fe9226F179110F6226BEA7Ddae8f3965F204b8";
const fundContract = new web3.eth.Contract(Crowdfund, contractAddress);

function App() {
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState();
  const [withdrawAmount, setWithdrawAmount] = useState();

  const handleLaunch = async() => {
    await fundContract.methods.launch(startTime, endTime)
    .send({from: web3.currentProvider.selectedAddress});
  };

  async function getBalance() {
    const balance = await fundContract.methods.viewTotalBalance().call();
    setBalance(web3.utils.fromWei(balance.toString(), 'ether'));
  }



  const donate = async() => {
    const amountToSend = web3.utils.toWei(amount.toString(), 'ether');
    const functionArgs = { from: web3.currentProvider.selectedAddress, value: amountToSend };
    await fundContract.methods.sendFunds().send(functionArgs);
  }

  const claimFunds = async() => {
    await fundContract.methods.claim().send({ from: web3.currentProvider.selectedAddress, gas: 100000, value: 0 });
    setBalance((parseFloat(balance) - parseFloat(withdrawAmount)).toFixed(2));
    setWithdrawAmount('0');
  }

  return (
    <div className="App"
    style={{ 
      backgroundImage: "url(/images/bgImg.png)", height:'100vh'}}>
    <div className="launch">
      <div className='startTime'>
        <label htmlFor="starting">Start Time: </label>
      <input
        type="textbox"
        placeholder="Enter start time[UNIX]..."
        // value={startDate}
        value={startTime}
        onChange={(e) => {
          setStartTime(e.target.value)
        }}
        />
        </div>
        <div className='endTime'>
        <label htmlFor="ending">End Time: </label>
      <input
        type="textbox"
        placeholder="Enter end time[UNIX]..."
        // value={endDate}
        value={endTime}
        onChange={(e) => {
          setEndTime(e.target.value)
        }}
        />
        </div>
        <div>
      <button onClick={handleLaunch}>Launch Crowdfunding</button>
      </div>
    </div>
    <div className='viewBal'>
        <button onClick={getBalance}>View Balance</button>
        <p>Your balance: {balance} ETH</p>
    </div>
    <h3>Send Ether to Smart Contract</h3>
      <div className='sendFund'>
        <input type="number"
        placeholder='Enter amount to send'
         value={amount}
          onChange={(e) => setAmount(e.target.value)} 
          />
        <button onClick={donate}>Send</button>
      </div>
    <div className='claim'>
      <button onClick={claimFunds}>Claim Funds</button>
    </div>
    </div>
  );
}

export default App;