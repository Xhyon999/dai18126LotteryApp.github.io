const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "itemId",
				"type": "uint256"
			}
		],
		"name": "bid",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "revealWinners",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "amIWinner",
		"outputs": [
			{
				"name": "",
				"type": "uint256[3]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "finished",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "items",
		"outputs": [
			{
				"name": "itemId",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "otherOwner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "tokenCounts",
		"outputs": [
			{
				"name": "",
				"type": "uint256[3]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "winners",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

window.addEventListener('load', async () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({
                method:

                    'eth_requestAccounts'
            });

            // Acccounts now exposed
        } catch (error) {
            console.error(error);
        }
    }
});
if (typeof web3 != 'undefined') {
    web3 = new Web3(web3.currentProvider);
}

var currAccount;
//Sets the current address
web3.eth.getAccounts((err, acc) => {
    if(err){
        console.log(err);
        return;
    }
    else {
        currAccount = acc[0];
        document.getElementsByTagName('input')[0].value = currAccount;
    }
})

const contractAddr = '0xa64991e477526D1F833F9bc3Db4863b35F6e52E8';
const contract = new web3.eth.Contract(abi, contractAddr);

//Sets the owner address
async function getOwner(){
    const owner = await contract.methods.owner().call();
    document.getElementsByTagName('input')[1].value = owner;
}

getOwner();

//Set contract balance
async function getBalance(){
	const balance = await web3.eth.getBalance(contractAddr);
	document.getElementById('balanceTag').innerHTML += web3.utils.fromWei(balance) + ' ETH';
}
getBalance();

//Action events for bid buttons
document.getElementsByClassName('bidButton')[0].addEventListener('click', async () => {await contract.methods.bid(0).send({from: currAccount, value: web3.utils.toWei('0.01', 'ether')});})
document.getElementsByClassName('bidButton')[1].addEventListener('click', async () => {await contract.methods.bid(1).send({from: currAccount, value: web3.utils.toWei('0.01', 'ether')});})
document.getElementsByClassName('bidButton')[2].addEventListener('click', async () => {await contract.methods.bid(2).send({from: currAccount, value: web3.utils.toWei('0.01', 'ether')});})

//Action event for Reveal button
document.getElementById('revealButton').addEventListener('click', async () => {
    const tokens = await contract.methods.tokenCounts().call();
    for(var i=0; i<3; i++){
        document.getElementsByClassName('bidAmmount')[i].innerHTML = tokens[i];
    }
})

//Action event for Withdraw button
document.getElementById('withdrawButton').addEventListener('click', async () => {
	const balance  = await web3.eth.getBalance(contractAddr);
    await contract.methods.withdraw().send({from: currAccount,});
    alert('Withdraw to Owner Address');
})

//Action event for seeing if current user has won anything and if so what
document.getElementById('amIWinnerButton').addEventListener('click', async () => {
    const items = await contract.methods.amIWinner().call();
    var itemsWon = [];
    for(var i=0; i<3; i++){
        if(items[i] != 0){
            itemsWon.push(items[i]);
        }
    }

    if(itemsWon.length == 0){
        alert('You have not won any items');
    }
    else {
        alert('You won the items ' + itemsWon.toString());
    }
})

//Action event for revealing winners
document.getElementById('declareButton').addEventListener('click', async () => {
    await contract.methods.revealWinners().call();
    alert('Winners have been declared!');
})