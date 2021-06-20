const TONwrapperContract = {
    abi: {
        "ABI version": 2,
        "header": [
            "pubkey",
            "time",
            "expire"
        ],
        "functions": [
            {
                "name": "constructor",
                "inputs": [
                    {
                        "name": "rootWrappedTON",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "isRoot",
                "inputs": [
                    {
                        "name": "arg0",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "checkAddress",
                "inputs": [
                    {
                        "name": "_address",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "createZeroWallet",
                "inputs": [],
                "outputs": []
            },
            {
                "name": "setZeroWallet",
                "id": "0x126",
                "inputs": [
                    {
                        "name": "value0",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "getZeroAddress",
                "inputs": [],
                "outputs": [
                    {
                        "name": "walletZero",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "sendTransfer",
                "inputs": [
                    {
                        "name": "dest",
                        "type": "address"
                    },
                    {
                        "name": "value",
                        "type": "uint128"
                    },
                    {
                        "name": "bounce",
                        "type": "bool"
                    }
                ],
                "outputs": []
            },
            {
                "name": "getLengthQueue",
                "inputs": [],
                "outputs": [
                    {
                        "name": "length",
                        "type": "uint128"
                    }
                ]
            },
            {
                "name": "getAllQueue",
                "inputs": [],
                "outputs": [
                    {
                        "name": "queueArr",
                        "type": "uint256[]"
                    }
                ]
            },
            {
                "name": "wrapGrams",
                "id": "0x25",
                "inputs": [
                    {
                        "name": "destination",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "setDepositWallet",
                "id": "0x125",
                "inputs": [
                    {
                        "name": "value0",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "unwrapGrams",
                "id": "0x52",
                "inputs": [],
                "outputs": []
            },
            {
                "name": "balanceDepositWallet",
                "id": "0x152",
                "inputs": [
                    {
                        "name": "value0",
                        "type": "uint128"
                    }
                ],
                "outputs": []
            },
            {
                "name": "getBalanceTONgrams",
                "inputs": [],
                "outputs": [
                    {
                        "name": "balanceTONgrams",
                        "type": "uint128"
                    }
                ]
            },
            {
                "name": "getDepositAddress",
                "inputs": [
                    {
                        "name": "dexclient",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "dexclientDepositAddress",
                        "type": "address"
                    }
                ]
            }
        ],
        "data": [],
        "events": []
    },
    tvc: "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",
};
module.exports = { TONwrapperContract };