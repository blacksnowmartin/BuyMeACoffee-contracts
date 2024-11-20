export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

export const CONTRACT_ABI = [
  "event NewPayment(address indexed from, uint256 timestamp, string registrationNumber, string paymentDetails, uint256 amount)",
  "function payFees(string memory _registrationNumber, string memory _paymentDetails) public payable",
  "function getPayments() public view returns (tuple(address from, uint256 timestamp, string registrationNumber, string paymentDetails, uint256 amount)[] memory)",
  "function getStudentPayments(string memory _registrationNumber) public view returns (uint256)",
  "function institution() public view returns (address)"
]; 