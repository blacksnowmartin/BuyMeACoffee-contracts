I'll help you create a basic React frontend to interact with your SmartLearnChain contract. Here's a step-by-step guide:

1. First, create a new React project using Create React App:

```bash
npx create-react-app smart-learn-chain-frontend
cd smart-learn-chain-frontend
npm install ethers@5.7.2 @metamask/detect-provider
```

2. Create a new file for your contract ABI:

```javascript:src/contractABI.js
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

export const CONTRACT_ABI = [
  "event NewPayment(address indexed from, uint256 timestamp, string registrationNumber, string paymentDetails, uint256 amount)",
  "function payFees(string memory _registrationNumber, string memory _paymentDetails) public payable",
  "function getPayments() public view returns (tuple(address from, uint256 timestamp, string registrationNumber, string paymentDetails, uint256 amount)[] memory)",
  "function getStudentPayments(string memory _registrationNumber) public view returns (uint256)",
  "function institution() public view returns (address)"
];
```

3. Replace your App.js with this code:

```javascript:src/App.js
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
```

4. Add some basic styling in App.css:

```css:src/App.css
.App {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.App-header {
  text-align: center;
  margin-bottom: 30px;
}

.payment-form {
  max-width: 500px;
  margin: 0 auto 40px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.payment-form form div {
  margin-bottom: 15px;
}

.payment-form label {
  display: block;
  margin-bottom: 5px;
}

.payment-form input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.payments-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.payment-item {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.payment-item p {
  margin: 5px 0;
}
```

To use this frontend:

1. Deploy your contract to a network (testnet or local network)
2. Copy the deployed contract address and paste it in the `CONTRACT_ADDRESS` constant in `contractABI.js`
3. Start the React app:
```bash
npm start
```

This frontend will:
- Allow users to connect their MetaMask wallet
- Display the connected account address
- Provide a form to make fee payments
- Show a history of all payments made
- Automatically update when new payments are made

Make sure to:
1. Have MetaMask installed in your browser
2. Be connected to the correct network where your contract is deployed
3. Have some test ETH in your wallet for making payments

The interface will allow users to:
- Connect their wallet
- Enter student registration number
- Enter payment details
- Specify amount in ETH
- Make payments
- View all historical payments

Remember to replace `YOUR_DEPLOYED_CONTRACT_ADDRESS` with your actual deployed contract address in the `contractABI.js` file.