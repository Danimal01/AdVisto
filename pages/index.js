import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Home.module.css'; // Assuming you're using CSS modules
import Web3 from 'web3'; // Import Web3 library
import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit';

const IndexPage = () => {
  // State to store ads, user interactions, rewards, and reward history
  const [ads, setAds] = useState([]);
  const [userRewards, setUserRewards] = useState(0);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [web3, setWeb3] = useState(null); // State to store Web3 instance
  const [rewardContract, setRewardContract] = useState(null); // State to store RewardContract instance
  const [walletAddress, setWalletAddress] = useState(''); // State to store user's wallet address
  const [rewardType, setRewardType] = useState(''); // 'eth' for Ethereum, 'base' for Base
  const [selectedChain, setSelectedChain] = useState('mainNet');

  const [ethRewardContract, setEthRewardContract] = useState(null); // State to store Ethereum RewardContract instance
  const [baseRewardContract, setBaseRewardContract] = useState(null); // State to store Base RewardContract instance

  // Video reference
  const videoRef = useRef(null);

  const alchemyRpcUrl = 'https://eth-sepolia.g.alchemy.com/v2/2AjX_GisadCWbv8Vd9dL0lILAOblOWSx';

  const ethRpcUrl = 'https://eth-sepolia.g.alchemy.com/v2/2AjX_GisadCWbv8Vd9dL0lILAOblOWSx'; // Ethereum RPC URL
  const baseRpcUrl = 'https://base-sepolia.g.alchemy.com/v2/X0PVbPHOZmZHWhHSssqSRHNX2BQYDUq-'; // Base RPC URL
  
  const ethContractABI = [
    // Ethereum contract ABI
    {
      "inputs": [],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "RewardClaimed",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "claimReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "rewardsClaimed",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ];

  const baseContractABI = [
    {
      "inputs": [],
      "name": "claimReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "RewardClaimed",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "rewardsClaimed",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const mantleContractABI=[
    {
      "inputs": [],
      "name": "claimReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "RewardClaimed",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "rewardsClaimed",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const polygonCardonaSepoliaAbi=[
    {
      "inputs": [],
      "name": "claimReward",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "RewardClaimed",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "rewardsClaimed",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // const 

  const ethContractAddress = '0x1E21e0968C721eBDe1cd9387DD8eE7A8c672FE5C'; // Ethereum smart contract address
  const baseContractAddress = '0x035BDa1174e5708cF54dCEA75623C159F41ECC26'; // Base smart contract address
  const mantleContractAddress = '0x901cBd29D163A4055Ab0E40E03Faf31AB70B0E3C'
  const polygonCardonaSepoliaAddress='0x5CF9e9CDe0aC4e16b285a7CA6E37041440A55A95'
  

  const networkParams = {
    mainNet: {
      chainId: '0xaa36a7', // Example, update with actual Ethereum Sepolia chainId if different
      chainName: 'Main Net Sepolia',
      rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/2AjX_GisadCWbv8Vd9dL0lILAOblOWSx'],
      blockExplorerUrls: ['https://sepolia.etherscan.io'],
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18
      }
    },
    base: {
      chainId: '0x14a34',
      chainName: 'Base Sepolia TestNet',
      rpcUrls: ['https://base-sepolia.g.alchemy.com/v2/X0PVbPHOZmZHWhHSssqSRHNX2BQYDUq-'],
      blockExplorerUrls: ['https://sepolia.basescan.org'],
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18
      }
    },
    mantle: {
      chainId: '0x138b',  // 5003 in decimal
      chainName: 'Mantle Sepolia Testnet',
      rpcUrls: ['https://rpc.sepolia.mantle.xyz'],
      blockExplorerUrls: ['https://explorer.sepolia.mantle.xyz'],  // Adjust based on actual explorer URL if different
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',  // Use actual symbol if different
        decimals: 18
      }
    },
    polygonCardonaSepolia: {
      chainId: '0x98A',  // Hexadecimal value of 2442
      chainName: 'Polygon zEVM Cardona Testnet',
      rpcUrls: ['https://polygon-zkevm-cardona.blockpi.network/v1/rpc/public'],
      blockExplorerUrls: ['https://cardona-zkvm.polygonscan.com'],
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18
      }
    }
    
  };

  useEffect(() => {
    const setInitialNetwork = async () => {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkParams[selectedChain]],
        });
      } catch (error) {
        console.error('Error setting initial network:', error);
      }
    };
    setInitialNetwork();
  }, []);

  useEffect(() => {
    const handleChainChange = (chainId) => {
      console.log(`Chain changed to ${chainId}`);
      // Optionally, update any relevant state here if needed
    };
  
    window.ethereum.on('chainChanged', handleChainChange);
  
    return () => {
      // This cleanup function removes the listener when the component unmounts
      window.ethereum.removeListener('chainChanged', handleChainChange);
    };
  }, []);
  
  
  const handleChainChange = async (e) => {
    const newChain = e.target.value;
    setSelectedChain(newChain);
  
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkParams[newChain]],
      });
  
      const web3Instance = new Web3(networkParams[newChain].rpcUrls[0]);
      setWeb3(web3Instance);
  
      let contractABI;
      let contractAddress;
      if (newChain === 'mainNet') {
        contractABI = ethContractABI;
        contractAddress = ethContractAddress;
      } else if (newChain === 'base') {
        contractABI = baseContractABI;
        contractAddress = baseContractAddress;
      } else if (newChain === 'mantle') {
        contractABI = mantleContractABI;
        contractAddress = mantleContractAddress;
      } else if (newChain === 'polygonCardonaSepolia') {
        contractABI = polygonCardonaSepoliaAbi;
        contractAddress = polygonCardonaSepoliaAddress;
      } else {
        console.error("Unsupported network");
        return;
      }
  
      const newContractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
      setRewardContract(newContractInstance);
    } catch (error) {
      console.error('Error changing network or initializing contract:', error);
    }
  };
  

  useEffect(() => {
    console.log("Current reward contract address:", rewardContract?._address);
    console.log("Web3 instance URL:", web3?._provider?.host);
  }, [rewardContract, web3]);

  useEffect(() => {
    console.log("Selected Chain:", selectedChain);
    console.log("Reward Contract Address:", rewardContract?._address);
  }, [selectedChain, rewardContract]);
  
  
  
  

  
  useEffect(() => {
    const initWeb3AndContracts = async () => {
      if (window.ethereum) {
        await window.ethereum.enable(); // Request user's permission to connect
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
  
        const ethContract = new web3Instance.eth.Contract(ethContractABI, ethContractAddress);
        setEthRewardContract(ethContract);
  
        // For Base, create a separate Web3 instance if the networks are different
        const web3Base = new Web3(baseRpcUrl);
        const baseContract = new web3Base.eth.Contract(baseContractABI, baseContractAddress);
        setBaseRewardContract(baseContract);
      } else {
        console.error('Web3 not found. Please install MetaMask.');
      }
    };
  
    initWeb3AndContracts();
  }, [selectedChain]); // Run only once on component mount



  

  

// Adjust the initialization based on selectedChain to use correct Web3 instance
useEffect(() => {
  const initWeb3 = async () => {
    let rpcUrl = selectedChain === 'mainNet' ? ethRpcUrl : baseRpcUrl;
    const web3Instance = new Web3(rpcUrl);
    setWeb3(web3Instance);

    if (window.ethereum) {
      try {
        await window.ethereum.enable(); // Request user's permission to connect
        setRewardContract(new web3Instance.eth.Contract(selectedChain === 'mainNet' ? ethContractABI : baseContractABI, selectedChain === 'mainNet' ? ethContractAddress : baseContractAddress));
      } catch (error) {
        console.error('Error connecting to Web3:', error);
      }
    } else {
      console.error('Web3 not found. Please install MetaMask.');
    }
  };

  initWeb3();
}, [selectedChain]); // Re-initialize when selectedChain changes



const claimReward = async () => {
  if (!window.ethereum) {
    console.error('MetaMask is not installed');
    return;
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' }); // This will prompt user to connect their wallet
    const web3Instance = new Web3(window.ethereum);
    const accounts = await web3Instance.eth.getAccounts();

    if (accounts.length === 0) {
      console.error('No accounts found.');
      return;
    }

    let contractABI, contractAddress, transactionParameters = {};
    if (selectedChain === 'mainNet') {
      contractABI = ethContractABI;
      contractAddress = ethContractAddress;
    } else if (selectedChain === 'base') {
      contractABI = baseContractABI;
      contractAddress = baseContractAddress;
    } else if (selectedChain === 'mantle') {
      contractABI = mantleContractABI;
      contractAddress = mantleContractAddress;
    } else if (selectedChain === 'polygonCardonaSepolia') {
      contractABI = polygonCardonaSepoliaAbi;
      contractAddress = polygonCardonaSepoliaAddress;
      // Fetch current gas price and set it explicitly for Polygon Cardona Sepolia
      const gasPrice = await web3Instance.eth.getGasPrice();
      transactionParameters = { gasPrice: gasPrice }; // Explicitly set gasPrice for networks not supporting EIP-1559
    } else {
      console.error("Unsupported network");
      return;
    }

    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);

    await contractInstance.methods.claimReward().send({
      from: accounts[0],
      ...transactionParameters // Spread operator to apply conditional parameters
    });
    console.log(`Reward claimed successfully on ${selectedChain}`);
    setUserRewards((prevRewards) => prevRewards + 0.0002); // Adjust the reward increment as needed
  } catch (error) {
    console.error(`Error claiming reward on ${selectedChain}:`, error);
  }
};






    const fetchAds = async (chain) => {
      setIsLoading(true);
      try {
        const response = await fetch('/mockAds.json'); // Update this path as needed
        const allAds = await response.json();
        const filteredAds = allAds.ads.filter(ad => ad.chain === chain);
        setAds(filteredAds);
      } catch (error) {
        console.error('Failed to fetch ads:', error);
      }
      setIsLoading(false);
    };
    
    useEffect(() => {
      const chainKey = selectedChain === 'polygonCardonaSepolia' ? 'polygon' : selectedChain; // Handling the chain key for fetching ads
      fetchAds(chainKey);
    }, [selectedChain]); // Refetch when selectedChain changes
    

  useEffect(() => {
    // Function to request fullscreen for the video element
    const requestFullScreen = () => {
      if (videoRef.current) {
        videoRef.current.requestFullscreen();
      }
    };

    // Automatically request fullscreen when the video becomes visible
    if (isVideoVisible) {
      requestFullScreen();
    }

    // Clean up the fullscreen request when the component unmounts
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [isVideoVisible]);

// Function to handle ad interaction
const handleAdClick = async (ad) => {
  setActiveVideoUrl(ad.videoUrl);
  setIsVideoVisible(true);
  setRewardType(ad.chain);

  // Set the reward contract type based on the ad clicked
  // We use a new state to store which type of reward should be claimed
  setRewardType(ad.chain === 'base' ? 'base' : 'eth');

  const interactionResponse = await fetch('/api/ads/interaction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adId: ad.adId, userId: 'user456', action: 'click' }),
  });
  const interactionData = await interactionResponse.json();
  const allocateResponse = await fetch('/api/rewards/allocate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'user456', adId: ad.adId }),
  });
  const allocateData = await allocateResponse.json();
  setUserRewards((prevRewards) => prevRewards + allocateData.reward);
};


  const handleVideoEnded = async () => {
    setIsVideoVisible(false);
    setIsModalOpen(true);
    // Here you would implement the logic to record proof of engagement
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


// Function to fetch reward history
// Function to fetch reward history with adjusted handling for Polygon Cardona Sepolia
const fetchRewardHistory = async () => {
  if (!web3 || !rewardContract || !walletAddress) {
    console.error('Web3, contract instance, or wallet address not initialized.');
    return;
  }

  try {
    if (!['mainNet', 'base', 'mantle', 'polygonCardonaSepolia'].includes(selectedChain)) {
      console.error("Unsupported network");
      return;
    }

    const currentBlockNumber = await web3.eth.getBlockNumber();
    const currentBlock = Number(currentBlockNumber); // Ensure the block number is a standard number
    let transactionHashes = [];

    if (selectedChain === 'polygonCardonaSepolia') {
      // Special handling for Polygon Cardona Sepolia due to block range limit
      const maxRange = 1024;  // Maximum block range for a single query
      let fromBlock = 0;

      while (fromBlock < currentBlock) {
        let endBlock = Math.min(fromBlock + maxRange, currentBlock);
        const events = await rewardContract.getPastEvents('RewardClaimed', {
          filter: { user: walletAddress },
          fromBlock: fromBlock,
          toBlock: endBlock,
        });
        transactionHashes.push(...events.map(event => event.transactionHash));
        fromBlock = endBlock + 1;  // Increment to proceed to the next range
      }
    } else {
      // Default handling for other networks
      const events = await rewardContract.getPastEvents('RewardClaimed', {
        filter: { user: walletAddress },
        fromBlock: 0,
        toBlock: 'latest',
      });
      transactionHashes = events.map(event => event.transactionHash);
    }

    // Update the state with the transaction hashes
    setRewardHistory(transactionHashes);
  } catch (error) {
    console.error('Error fetching reward history:', error);
  }
};







const getTransactionUrl = (hash) => {
  const baseUrl = networkParams[selectedChain].blockExplorerUrls[0];
  return `${baseUrl}/tx/${hash}`;
};


    // Function to handle form submission
    const handleSubmit = (event) => {
      event.preventDefault();
      fetchRewardHistory();
    };

  // Function to handle mock authentication
  const authenticateUser = async () => {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: 'testKey', apiSecret: 'testSecret' }),
    });

    const data = await response.json();
    setAccessToken(data.accessToken);
  };

  // Call the authentication function when the component mounts
  useEffect(() => {
    authenticateUser();
  }, []);



  const onSuccess = (result) => {
    // Log the success or perform further actions
    console.log(`Verification success. Nullifier hash: ${result.nullifier_hash}`);
    claimReward(); // Now call the existing claimReward function only after successful verification
  };
  
  const handleVerify = (proof) => {
    console.log("Proof received:", proof);
  };

  const clearRewardHistory = () => {
    setRewardHistory([]);
  };

  return (
    <div className={styles.container}>
      <h1>AdVisto White Label API Solution</h1>
    <p>
      AdVisto redefines digital advertising by empowering users to earn rewards directly through engagement. Our white-label API suite enables businesses to integrate and customize user-centric advertising models. By participating, users not only discover products but also earn cryptocurrency rewards, enhancing engagement and loyalty. AdVisto bridges Web2 and Web3 ecosystems, offering scalable, blockchain-powered solutions that ensure transparency and effectiveness in advertising strategies.
    </p>
      <p>Your Access Token: {accessToken}</p>
      <h2>Available Ads</h2>
      <div className={styles.dropdown}>
  <label htmlFor="chain-select">Choose a chain:</label>
  <select id="chain-select" value={selectedChain} onChange={handleChainChange}>
    <option value="mainNet">Main Net Sepolia</option>
    <option value="base">Base Sepolia</option>
    <option value="mantle">Mantle Sepolia TestNet</option>
    <option value="polygonCardonaSepolia">Polygon Cardona Sepolia</option> {/* New option */}

  </select>
</div>

      <div className={styles.adsContainer}>
        {isLoading ? (
          <p>Loading ads...</p>
        ) : (
          ads.map((ad) => (
            <div
              key={ad.adId}
              className={styles.adItem}
              onClick={() => handleAdClick(ad)}
            >
              <img src={ad.imageUrl} alt={ad.description} className={styles.adImage} />
              <p>{ad.description}</p>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
  <div className={styles.modal}>
    <div className={styles.modalContent}>
      <span className={styles.close} onClick={closeModal}>&times;</span>
      <h2>Congratulations!</h2>
      <p>You've watched the entire ad. Verify to claim your reward.</p>
      <IDKitWidget
        app_id="app_e294029cf5121141d7ea27c6b6f749e1"  // Replace with your actual app_id
        action="claim_reward"  // This should be the action configured in the Developer Portal
        onSuccess={onSuccess}
        handleVerify={handleVerify}
        verification_level={VerificationLevel.Device}
      >
        {({ open }) => <button onClick={open}>Verify with World ID and Claim Reward!</button>}
      </IDKitWidget>
    </div>
  </div>
)}

      {/* Video Player */}
      {isVideoVisible && activeVideoUrl && (
        <div className={styles.videoWrapper}>
          <video
            ref={videoRef}
            autoPlay
            onEnded={handleVideoEnded}
            controls
            controlsList="nodownload"
          >
            <source src={activeVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          Enter your wallet address:
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </label>
        <button type="submit">Fetch Rewards</button>
      </form>

      <h2>
        Rewards Transactions:
        {/* Conditionally render the clear button if there are items in the reward history */}
        {rewardHistory.length > 0 && (
          <button onClick={clearRewardHistory} style={{marginLeft: "10px"}}>
            X
          </button>
        )}
      </h2>
      <ul className={styles.rewardHistory}>
      {rewardHistory.length > 0 && rewardHistory.map((historyItem, index) => (
        <li key={index}>
          <a
            href={getTransactionUrl(historyItem, selectedChain)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.transactionLink}
          >
            Transaction: {historyItem}
          </a>
        </li>
      ))}
    </ul>


    </div>
  );
};

export default IndexPage;