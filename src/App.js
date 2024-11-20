import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contractABI';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [payments, setPayments] = useState([]);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    initializeEthereum();
  }, []);

  const initializeEthereum = async () => {
    try {
      const provider = await detectEthereumProvider();
      
      if (provider) {
        // Connect to MetaMask
        await provider.request({ method: 'eth_requestAccounts' });
        const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = ethersProvider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        // Initialize contract
        const smartLearnContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );
        setContract(smartLearnContract);

        // Load payments
        loadPayments(smartLearnContract);

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          setAccount(accounts[0]);
        });
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error initializing ethereum:', error);
    }
  };

  const loadPayments = async (contractInstance) => {
    try {
      const allPayments = await contractInstance.getPayments();
      setPayments(allPayments);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  };

  const handlePayFees = async (e) => {
    e.preventDefault();
    try {
      const amountInWei = ethers.utils.parseEther(amount);
      const tx = await contract.payFees(
        registrationNumber,
        paymentDetails,
        { value: amountInWei }
      );
      await tx.wait();
      alert('Payment successful!');
      loadPayments(contract);
      
      // Clear form
      setRegistrationNumber('');
      setPaymentDetails('');
      setAmount('');
    } catch (error) {
      console.error('Error paying fees:', error);
      alert('Error making payment. Check console for details.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>SmartLearnChain Fee Payment System</h1>
        {account ? (
          <p>Connected Account: {account}</p>
        ) : (
          <button onClick={initializeEthereum}>Connect Wallet</button>
        )}
      </header>

      <main>
        <section className="payment-form">
          <h2>Pay Fees</h2>
          <form onSubmit={handlePayFees}>
            <div>
              <label>Registration Number:</label>
              <input
                type="text"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Payment Details:</label>
              <input
                type="text"
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Amount (ETH):</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <button type="submit">Pay Fees</button>
          </form>
        </section>

        <section className="payment-history">
          <h2>Payment History</h2>
          <div className="payments-list">
            {payments.map((payment, index) => (
              <div key={index} className="payment-item">
                <p>Student: {payment.registrationNumber}</p>
                <p>Details: {payment.paymentDetails}</p>
                <p>Amount: {ethers.utils.formatEther(payment.amount)} ETH</p>
                <p>From: {payment.from}</p>
                <p>Time: {new Date(payment.timestamp.toNumber() * 1000).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App; 