// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Crowdfund{
    address payable public owner;
    uint goal;
    uint raised;
    uint startAt;
    uint endAt;
    bool claimed;
    uint numOfDonors;
    uint maxDuration;
    mapping(address => uint) public donors;


    constructor(uint _goal, uint _maxDuration) {
        owner = payable(msg.sender);
        goal = _goal;
        maxDuration = _maxDuration;
    }

    function launch(uint32 _startAt, uint32 _endAt) external {
        require(msg.sender == owner, "You can not launch the crowdfunding");
        require(_startAt >= block.timestamp, "Please enter correct time for launch");
        require(_endAt > _startAt, "End time can not be earlier than starting time");
        require(_endAt < block.timestamp + maxDuration);
        startAt = _startAt;
        endAt = _endAt;
        // emit Launch(msg.sender, _goal, _startAt, _endAt);
    }


    function sendFunds() external payable{
        require(block.timestamp >= startAt, "Campaign has not Started yet");
        require(block.timestamp <= endAt, "Campaign has already ended");

        if(donors[msg.sender] == 0){
            numOfDonors++;
        }
        raised = raised + msg.value;
        donors[msg.sender] = donors[msg.sender] + msg.value;
 
        // emit Sendfunds(msg.sender, _amount);
    }

    function viewTotalBalance() external view returns(uint) {
        return address(this).balance;
    }

    function claim() public {
        require(msg.sender == owner, "You are not the creator");
        require(endAt < block.timestamp, "The campaign has not yet ended");
        require(raised >= goal, "Goal not achieved");
        require(!claimed, "Already claimed");

        claimed = true;
        uint transferAmount = raised;
        raised = 0;
        owner.transfer(transferAmount);
        // emit Claim();
    }
}