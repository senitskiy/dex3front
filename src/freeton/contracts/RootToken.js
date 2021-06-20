const RootTokenContract = {
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
                        "name": "name",
                        "type": "bytes"
                    },
                    {
                        "name": "symbol",
                        "type": "bytes"
                    },
                    {
                        "name": "decimals",
                        "type": "uint8"
                    },
                    {
                        "name": "root_public_key",
                        "type": "uint256"
                    },
                    {
                        "name": "root_owner",
                        "type": "uint256"
                    },
                    {
                        "name": "wallet_code",
                        "type": "cell"
                    },
                    {
                        "name": "total_supply",
                        "type": "uint128"
                    }
                ],
                "outputs": [],
                "id": "0xb"
            },
            {
                "name": "deployWallet",
                "inputs": [
                    {
                        "name": "_answer_id",
                        "type": "uint32"
                    },
                    {
                        "name": "workchain_id",
                        "type": "int8"
                    },
                    {
                        "name": "pubkey",
                        "type": "uint256"
                    },
                    {
                        "name": "internal_owner",
                        "type": "uint256"
                    },
                    {
                        "name": "tokens",
                        "type": "uint128"
                    },
                    {
                        "name": "grams",
                        "type": "uint128"
                    }
                ],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "address"
                    }
                ],
                "id": "0xc"
            },
            {
                "name": "deployEmptyWallet",
                "inputs": [
                    {
                        "name": "_answer_id",
                        "type": "uint32"
                    },
                    {
                        "name": "workchain_id",
                        "type": "int8"
                    },
                    {
                        "name": "pubkey",
                        "type": "uint256"
                    },
                    {
                        "name": "internal_owner",
                        "type": "uint256"
                    },
                    {
                        "name": "grams",
                        "type": "uint128"
                    }
                ],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "address"
                    }
                ],
                "id": "0xd"
            },
            {
                "name": "grant",
                "inputs": [
                    {
                        "name": "dest",
                        "type": "address"
                    },
                    {
                        "name": "tokens",
                        "type": "uint128"
                    },
                    {
                        "name": "grams",
                        "type": "uint128"
                    }
                ],
                "outputs": [],
                "id": "0xe"
            },
            {
                "name": "mint",
                "inputs": [
                    {
                        "name": "tokens",
                        "type": "uint128"
                    }
                ],
                "outputs": [],
                "id": "0xf"
            },
            {
                "name": "getName",
                "inputs": [],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "bytes"
                    }
                ],
                "id": "0x10"
            },
            {
                "name": "getSymbol",
                "inputs": [],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "bytes"
                    }
                ],
                "id": "0x11"
            },
            {
                "name": "getDecimals",
                "inputs": [],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "uint8"
                    }
                ],
                "id": "0x12"
            },
            {
                "name": "getRootKey",
                "inputs": [],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "uint256"
                    }
                ],
                "id": "0x13"
            },
            {
                "name": "getTotalSupply",
                "inputs": [],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "uint128"
                    }
                ],
                "id": "0x14"
            },
            {
                "name": "getTotalGranted",
                "inputs": [],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "uint128"
                    }
                ],
                "id": "0x15"
            },
            {
                "name": "getWalletCode",
                "inputs": [],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "cell"
                    }
                ],
                "id": "0x16"
            },
            {
                "name": "getWalletAddress",
                "inputs": [
                    {
                        "name": "workchain_id",
                        "type": "int8"
                    },
                    {
                        "name": "pubkey",
                        "type": "uint256"
                    },
                    {
                        "name": "owner_std_addr",
                        "type": "uint256"
                    }
                ],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "address"
                    }
                ],
                "id": "0x17"
            },
            {
                "name": "getWalletCodeHash",
                "inputs": [],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "uint256"
                    }
                ],
                "id": "0x18"
            }
        ],
        "events": []
    },
    tvc: "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",
};
module.exports = { RootTokenContract };
