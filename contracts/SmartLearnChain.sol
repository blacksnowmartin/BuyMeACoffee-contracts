// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Deployed it to 0x5FbDB2315678afecb367f032d93F642f64180aa3

contract SmartLearnChain {
    // Event to emit when a fee payment is made
    event NewPayment(
        address indexed from,
        uint256 timestamp,
        string registrationNumber,
        string paymentDetails,
        uint256 amount
    );
    
    // Payment struct
    struct Payment {
        address from;
        uint256 timestamp;
        string registrationNumber;
        string paymentDetails;
        uint256 amount;
    }
    
    // Address of school/institution wallet
    address payable public institution;
    
    // List of all payments received
    Payment[] payments;
    
    // Mapping to track student payments
    mapping(string => uint256) public studentPayments;

    constructor() {
        institution = payable(msg.sender);
    }

    /**
     * @dev fetches all stored payments
     */
    function getPayments() public view returns (Payment[] memory) {
        return payments;
    }

    /**
     * @dev pay school fees
     * @param _registrationNumber student's registration number
     * @param _paymentDetails payment details (e.g., "Semester 1 2024", "Full Year")
     */
    function payFees(string memory _registrationNumber, string memory _paymentDetails) public payable {
        // Must send some ETH for fee payment
        require(msg.value > 0, "Payment amount must be greater than 0!");

        // Add the payment record to storage
        payments.push(Payment(
            msg.sender,
            block.timestamp,
            _registrationNumber,
            _paymentDetails,
            msg.value
        ));

        // Update student payment record
        studentPayments[_registrationNumber] += msg.value;

        // Emit payment event
        emit NewPayment(
            msg.sender,
            block.timestamp,
            _registrationNumber,
            _paymentDetails,
            msg.value
        );
    }

    /**
     * @dev check total payments made by a student
     */
    function getStudentPayments(string memory _registrationNumber) public view returns (uint256) {
        return studentPayments[_registrationNumber];
    }

    /**
     * @dev withdraw collected fees (only institution can call this)
     */
    function withdrawFees() public {
        require(msg.sender == institution, "Only institution can withdraw fees");
        require(institution.send(address(this).balance));
    }
}