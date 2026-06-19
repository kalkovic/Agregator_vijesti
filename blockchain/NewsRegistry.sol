// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NewsRegistry {
    struct NewsEvent {
        string eventId;      
        string contentHash;  
        uint256 timestamp;   
        address author;     
    }

    mapping(string => NewsEvent) public events;

    event NewsStored(string eventId, string contentHash, uint256 timestamp);

    function storeEvent(string memory _eventId, string memory _contentHash) public {
        require(events[_eventId].timestamp == 0, "Dogadaj je vec zapisan na blockchainu!");

        events[_eventId] = NewsEvent({
            eventId: _eventId,
            contentHash: _contentHash,
            timestamp: block.timestamp,
            author: msg.sender
        });

        emit NewsStored(_eventId, _contentHash, block.timestamp);
    }

    function getEventHash(string memory _eventId) public view returns (string memory) {
        require(events[_eventId].timestamp != 0, "Dogadaj ne postoji na blockchainu.");
        return events[_eventId].contentHash;
    }
}