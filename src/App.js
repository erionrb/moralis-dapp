import React, { useEffect, useState } from "react";
import { ConnectButton, Modal } from "web3uikit";
import "./App.css";
import logo from "./images/Moralis.png";
import Coin from "./components/Coin";
import { abouts } from "./about";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";

const App = () => {
  const [btc, setBtc] = useState(50);
  const [eth, setEth] = useState(50);
  const [link, setLink] = useState(50);
  const [modalPrice, setModalPrice] = useState();
  const web3Api = useMoralisWeb3Api();
  const { Moralis, isInitialized } = useMoralis();
  const serverUrl = "https://evacqlkya6eo.usemoralis.com:2053/server";
  const appId = "jhmvLx4WUxVDL8bcDWwYcycbm4UOG35lmSSAWI20";
  const moralisSecret = "W45EX2VLYumUzaV";

  (async () => {
    await Moralis.start({ serverUrl, appId, moralisSecret });
  })();
  const [visible, setVisible] = useState(false);
  const [modalToken, setModalToken] = useState();

  async function getRatio(tick, setPerc) {
    const Votes = Moralis.Object.extend("Votes");
    const query = new Moralis.Query(Votes);
    query.equalTo("ticker", tick);
    query.descending("createdAt");
    const results = await query.first();
    if (results) {
      const vote = results.attributes;
      let up = Number(vote.up);
      let down = Number(vote.down);
      let ratio = Math.round((up / (up + down)) * 100);
      setPerc(ratio);
      console.log(`Ticker [${vote.ticker}] Up[${vote.up}] down[${vote.down}]`);
    }
  }

  useEffect(() => {
    if (isInitialized) {
      getRatio("BTC", setBtc);
      getRatio("ETH", setEth);
      getRatio("LINK", setLink);
    }

    async function createLiveQuery() {
      let query = new Moralis.Query("Votes");
      let subscription = await query.subscribe();
      subscription.on("udpate", (object) => {
        if (object.attributes === "LINK") {
          getRatio("LINK", setLink);
        } else if (object.attributes === "ETH") {
          getRatio("ETH", setEth);
        } else if (object.attributes === "BTC") {
          getRatio("BTC", setBtc);
        }
      });
    }

    createLiveQuery();
  }, [isInitialized]);

  useEffect(() => {
    async function fetchTokenPrice() {
      const options = {
        address:
          abouts[abouts.findIndex((x) => x.token === modalToken)].address,
      };
      const price = await web3Api.token.getTokenPrice(options);
      setModalPrice(price.usdPrice.toFixed(2));
    }

    if (modalToken) fetchTokenPrice();
  }, [modalToken]);

  useEffect(() => {
    if (btc > 100) setBtc(100);
    else return;
  }, [btc]);

  return (
    <>
      <div className="header">
        <div className="logo">
          <img src={logo} alt="logo" height="50 px" />
          Sentiment
        </div>
        <ConnectButton />
      </div>
      <div className="instructions">
        Where do you think these tokens are going? Up or Down?
      </div>
      <div className="list">
        <Coin
          perc={btc}
          setPerc={setBtc}
          token={"BTC"}
          setModalToken={setModalToken}
          setVisible={setVisible}
        />
        <Coin
          perc={eth}
          setPerc={setEth}
          token={"ETH"}
          setModalToken={setModalToken}
          setVisible={setVisible}
        />
        <Coin
          perc={link}
          setPerc={setLink}
          token={"LINK"}
          setModalToken={setModalToken}
          setVisible={setVisible}
        />
      </div>
      <Modal
        isVisible={visible}
        onCloseButtonPressed={() => setVisible(false)}
        hasFooter={false}
        title={modalToken}
      >
        <div>
          <span style={{ color: "white" }}>{`Price: `}</span>
          {modalPrice}$
        </div>

        <div>
          <span style={{ color: "white" }}>{`About`}</span>
        </div>

        <div>
          {modalToken &&
            abouts[abouts.findIndex((x) => x.token === modalToken)].about}
        </div>
      </Modal>
    </>
  );
};

export default App;
