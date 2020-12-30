// class App.js v2.0 of Dec 29,2020
import React, { Component } from 'react';	      // from node.js module
import Avatar from 'avataaars'; 	              // from node.js module
import { BounceLoader } from 'react-spinners'; 	// from node.js module
import getWeb3 from "./getWeb3";                                  // to call web3 API
import Pepito from "./contracts_abi/Pepito.json";                 // to call web3 API
//import PepitoDisguise from "./contracts_abi/PepitoDisguise.json"; // to call web3 API 
import './App.css';                                 // specific
import OptionTable from './OptionTable'; 	          // specific
import { setRandomDisguise, makePepito, tryIt } from './helpers';      // specific

/**
 * @author Vu Tien Khang - December 2020
 * @notice React root component for Pepito frontend
 * @dev disguise random options - done
 * @dev web3 calls - work in progress
 * @dev creating Pepito and PepitoDisguise - done
 * @dev calling functions in PepitoDisguise - to be done
 */
class App extends Component {

  constructor() {
    super()           // run super to create 'Component' before running the constructor of App, the derived class 
    this.state = {};	// state holds variables of the component App
    this.options = {	// disguise options
      topType: ['Eyepatch', 'Hat', 'Hijab', 'LongHairBigHair', 'LongHairBob', 'LongHairBun', 'LongHairCurly', 'LongHairCurvy', 'LongHairDreads', 'LongHairFrida', 'LongHairFro', 'LongHairFroBand', 'LongHairMiaWallace', 'LongHairNotTooLong', 'LongHairShavedSides', 'LongHairStraight', 'LongHairStraight2', 'LongHairStraightStrand', 'NoHair', 'ShortHairDreads01', 'ShortHairDreads02', 'ShortHairFrizzle', /*'ShortHairShaggy',*/ 'ShortHairShaggyMullet', 'ShortHairShortCurly', 'ShortHairShortFlat', 'ShortHairShortRound', 'ShortHairShortWaved', 'ShortHairSides', 'ShortHairTheCaesar', 'ShortHairTheCaesarSidePart', 'Turban', 'WinterHat1', 'WinterHat2', 'WinterHat3', 'WinterHat4'],
      hatColor: ['Black', 'Blue01', 'Blue02', 'Blue03', 'Gray01', 'Gray02', 'Heather', 'PastelBlue', 'PastelGreen', 'PastelOrange', 'PastelRed', 'PastelYellow', 'Pink', 'Red', 'White'],
      accessoriesType: ['Blank', 'Kurt', 'Prescription01', 'Prescription02', 'Round', 'Sunglasses', 'Wayfarers'],
      hairColor: ['Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'PastelPink', 'Platinum', 'Red', 'SilverGray'],
      facialHairType: ['BeardLight', 'BeardMagestic', 'BeardMedium', 'Blank', 'MoustacheFancy', 'MoustacheMagnum'],
      facialHairColor: ['Auburn', 'Black', 'Brown', 'BrownGolden', 'brownBlack', 'Platinum', 'red'],
      clotheType: ['BlazerShirt', 'BlazerSweater', 'CollarSweater', 'GraphicShirt', /*'Graphics',*/ 'Hoodie', 'Overall', 'ShirtCrewNeck', 'ShirtScoopNeck', 'ShirtVNeck'],
      clotheColor: ['Black', 'Blue01', 'Blue02', 'Blue03', 'Gray01', 'Gray02', 'Heather', 'PastelBlue', 'PastelGreen', 'PastelOrange', 'PastelRed', 'PastelYellow', 'Pink', 'Red', 'White'],
      eyeType: ['Close', 'Cry', 'Default', 'Dizzy', 'EyeRoll', 'Happy', 'Hearts', 'Side', 'Squint', 'Surprised', 'Wink', 'WinkWacky'],
      eyebrowType: ['Angry', 'AngryNatural', 'Default', 'DefaultNatural', 'FlatNatural', 'FrownNatural', 'RaisedExcited', 'RaisedExcitedNatural', 'SadConcerned', 'SadConcernedNatural', 'UnibrowNatural', 'UpDown', 'UpDownNatural'],
      mouthType: ['Concerned', 'Default', 'Disbelief','Eating', 'Grimace', 'Sad', 'ScreamOpen', 'Serious', 'Smile', 'Tongue', 'Twinkle', 'Vomit'],
      skinColor: ['Tanned', 'Yellow', 'Pale', 'Light', 'Brown', 'DarkBrown', 'Black']
    }
    this.setState({loading: false, web3Connect: false});
  }

  state = { web3: null, accounts: null, pepitoContract: null, ownerPepito: null };          // to call web3 API

  componentDidMount = async () => {
    /** @notice React hook that runs after the first render() lifecycle  */
    /** ----- trial using an external function */
    const myWord = tryIt();
    this.setState(myWord);
    /** ----- end trial */
    this.setState(setRandomDisguise(this.options));   // sync. state = random set of disguise options
    this.makePepito();                      // async. connect to blockchain, create instance of Pepito
    // console.log("1.user account", this.state.accounts,
    // ".\n 1.makePepito().Pepito contract", this.state.contract,
    // ".\n  1.Pepito contract address", this.state.pepitoAddress,
    // ".\n   1.web3Connect", this.state.web3Connect,
    // ".\n    1.'owner' variable in Pepito", this.state.ownerPepito);
};

makePepito = async () => {
  /**
   * @notice connect web3 API and create Pepito contract
   * @dev tested and validated Dec 30
  */
  try {
      /// @dev access to blockchain via Metamask
      /// @dev get network provider and web3 instance by trying several channels 
      const web3 = await getWeb3();
      /// @dev ***** TODO: check error when getWeb3 returns, in case Matamask not connected
      /// @dev use web3 to get the account of the user
      const accounts = await web3.eth.getAccounts();
      console.log("0.user account", accounts);

      /// @dev create a Pepito singleton contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Pepito.networks[networkId];
      const pepitoInstance = new web3.eth.Contract(
        Pepito.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const ownerPepito = await pepitoInstance.methods.owner().call();
      var web3Connect = true;

      /// @dev set web3, accounts, and contract to the state 
      const web3Pepito = { web3, accounts, contract: pepitoInstance, pepitoAddress: deployedNetwork.address, web3Connect, ownerPepito } 
      this.setState({ web3, accounts, contract: pepitoInstance, pepitoAddress: deployedNetwork.address, web3Connect, ownerPepito }); 
      console.log("1.user account", this.state.accounts,
          ".\n 1.makePepito().Pepito contract", this.state.contract,
          ".\n  1.Pepito contract address", this.state.pepitoAddress,
          ".\n   1.web3Connect", this.state.web3Connect,
          ".\n    1.'owner' variable in Pepito", this.state.ownerPepito);
          // return web3Pepito;
  } catch (error) {
      /// @dev catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
  }
}

/** @notice section copied from truffle react, to be ignored
  runExample = async () => {
    const { accounts, contract } = this.state;
    // Stores a given value, 5 by default.
    await contract.methods.set(500).send({ from: accounts[0] });
    // Update state with the result.
    this.setState({ storageValue: response });
  };
  */ 

  storeDisguise = async () => {
    /** 
    * @notice create a PepitoDisguise and store the options of this disguise
    * @dev WIP - to be refined and tested
    * @dev this way to define storeDisguise as property of App is typical of React, to bind 'this'
    */
    const { accounts, pepitoContract, web3Connect, ownerPepito } = this.state;
    console.log("storeDisguise, user account", accounts,
      ".\n 2.storeDisguise, Pepito contract", pepitoContract,
      ".\n  2.storeDisguise, web3Connect", web3Connect,
      ".\n   2.storeDisguise, 'owner' variable in Pepito", ownerPepito);

    if(web3Connect){
      const pepitoDisguise = await pepitoContract.methods.createPepitoDisguise();
      /// @dev bug to be changed: pepitoDisguise is currently a transaction object, not an address
      console.log("instance pepitoDisguise created by Pepito", pepitoDisguise);
      var HatColor = 1;    //  test value, should be the rank in the array of HatColor
      await pepitoDisguise.methods.setHatColor().call({ from: accounts[0] });
      const storedDisguise = await pepitoDisguise.methods.storedDisguise().call();
      console.log("storedDisguise", storedDisguise);

      /* 
      await pepitoDisguise.methods.setTopType().call({ from: accounts[0] });
      await pepitoDisguise.methods.setHatColor().call({ from: accounts[0] });
      await pepitoDisguise.methods.setAccessoriesType().call({ from: accounts[0] });
      await pepitoDisguise.methods.setHairColor().call({ from: accounts[0] });
      await pepitoDisguise.methods.setFacialHairType().call({ from: accounts[0] });
      await pepitoDisguise.methods.setFacialHairColor().call({ from: accounts[0] });
      await pepitoDisguise.methods.setClotheType().call({ from: accounts[0] });
      await pepitoDisguise.methods.setClotheColor().call({ from: accounts[0] });
      await pepitoDisguise.methods.setEyeType().call({ from: accounts[0] });
      await pepitoDisguise.methods.setEyebrowType().call({ from: accounts[0] });
      await pepitoDisguise.methods.setMouthType().call({ from: accounts[0] });
      await pepitoDisguise.methods.setSkinColor().call({ from: accounts[0] });
      */
    } else alert("Please reload page first, to get connected to local blockchain");
  }

  retrieveDisguise = async () => {
    /** 
    * @notice retrieve a PepitoDisguise from blockchain network and display it
    * @dev to be done
    */
  }

  render() {
    /// @dev retrieve pepito disguise options from this.state
    const {topType, hatColor, accessoriesType, hairColor, facialHairType, facialHairColor,
      clotheType, clotheColor, eyeType, eyebrowType, mouthType, skinColor} = this.state;
    return (
      <div className="container text-center">
        {this.state.error ? 	// if error is true
          <div className="alert alert-danger m-5" role="alert">
            Please check if Metamask is enabled and connected to the correct network
          </div>:<div></div>	// if error is false
        }
        <header>
          <h1 className="m-5">Pepito Disguises <sup>on blockchain</sup></h1>
        </header>
        <div>
          <p></p>
          <table>
            <tbody>
              <tr>
                <th rowSpan="3"><img src="./machupicchu_logo.png" alt="Machu-Picchu" width="120" height="120" /></th>
                <td><button className="btn btn-lg btn-secondary mb-5" 
                  onClick={this.setRandomDisguise}>Generate random disguise{this.state.myWord}</button></td>
              </tr>
              <tr>
                <td><button className="btn btn-lg btn-secondary mb-5" 
                onClick={this.storeDisguise}>Store disguise on blockchain (WIP - Reload page if crash)
                </button></td>
              </tr>
              <tr>
                <td><button className="btn btn-lg btn-secondary mb-5 disabled" 
                onClick={this.retrieveDisguise.bind(this)}>Retrieve disguise from blockchain network: INACTIVE - WIP -
                </button></td>
              </tr>
              <tr>
                <td colSpan="2">Pepito Address {this.state.pepitoAddress}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {this.state.loading ?
          <div className="spinner">	{/* if loading is true, waiting for random response */}
            <BounceLoader
              color={'#6c757d'}
              loading={this.state.loading}
            />
          </div>:	// else no more waiting, random response is returned
          <div className="avatar">
            <Avatar
              style={{width: '400px', height: '400px'}}
              avatarStyle='Circle'
              topType={topType}
              hatColor={hatColor}
              accessoriesType={accessoriesType}
              hairColor={hairColor}
              facialHairType={facialHairType}
              facialHairColor={facialHairColor}
              clotheType={clotheType}
              clotheColor={clotheColor}
              eyeType={eyeType}
              eyebrowType={eyebrowType}
              mouthType={mouthType}
              skinColor={skinColor}
            />
          </div>
        }
        {<OptionTable 
          topType={topType}
          hatColor={hatColor}
          accessoriesType={accessoriesType}
          hairColor={hairColor}
          facialHairType={facialHairType}
          facialHairColor={facialHairColor}
          clotheType={clotheType}
          clotheColor={clotheColor}
          eyeType={eyeType}
          eyebrowType={eyebrowType}
          mouthType={mouthType}
          skinColor={skinColor}
        />}
      </div>
    );
  }

}

export default App;
