import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../../providers/AuthProvider";
import { useContractContext } from "../../providers/ContractProvider";
import Loading from "../../components/loading";
import { config } from "../../config";
import {
  Box,
  Button,
  Container,
  Dialog,
  Divider,
  Typography,
} from "@mui/material";
import { Link as ScrollLink } from "react-scroll";
import SouthIcon from "@mui/icons-material/South";
import Header from "./header";
import SubTitle from "../../components/subTitle";
import EditBox from "../../components/editBox";

function Home() {
  const { address, setSnackbar } = useAuthContext();
  const { contract, web3 } =
    useContractContext();

  const tokenDetailRef = useRef(null);
  const addressRef = useRef(null);
  const infoRef = useRef(null);

  const [tokenReceipt, setTokenReceipt] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenSupply, setTokenSupply] = useState(1);
  const [maxWallet, setMaxWallet] = useState("2%");
  const [marketingWallet, setMarketingWallet] = useState("");
  const [maxTransaction, setMaxTransaction] = useState("2%");
  const [developmentWallet, setDevelopmentWallet] = useState("");
  const [routerDexAddress, setRouterDexAddress] = useState(
    "0x5FE315412D1AC145312531322F1B122EF2A"
  );
  const [website, setWebsite] = useState("");
  const [telegram, setTelegram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [initialMarketingTax, setInitialMarketingTax] = useState(0);
  const [initialDevelopmentTax, setInitialDevelopmentTax] = useState(0);
  const [initialLiquidityTax, setInitialLiquidityTax] = useState(0);
  const [finalMarketingTax, setFinalMarketingTax] = useState(0);
  const [finalDevelopmentTax, setFinalDevelopmentTax] = useState(0);
  const [finalLiquidityTax, setFinalLiquidityTax] = useState(0);

  const [loadingView, setLoadingView] = useState(false);

  const InitializeTokenValues = () => {
    // setTokenName("");
    // setTokenSymbol("");
    // setTokenSupply("");
    setMarketingWallet("");
    setWebsite("");
    setTelegram("");
    setTwitter("");

    setInitialMarketingTax(0);
    setInitialDevelopmentTax(0);
    setInitialLiquidityTax(0);
    setFinalMarketingTax(0);
    setFinalDevelopmentTax(0);
    setFinalLiquidityTax(0);
  }

  useEffect(() => {
    if (address) {
      setDevelopmentWallet(address);
    }
  }, [address]);

  const isERC20Address = (str) => {
    const pattern = /^(0x)?[0-9a-fA-F]{40}$/;
    return pattern.test(str);
  };

  useEffect(() => {
    if (tokenReceipt.status) {
      infoRef.current.focus();
      infoRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
    //window.scrollTo(0, document.documentElement.scrollHeight || document.body.scrollHeight);
  }, [tokenReceipt])
  const addMetamask = async (tokenAddress) => {
    if (!tokenAddress || !window.ethereum)
      return;

    const symbol = tokenSymbol; // Replace with your token symbol
    const decimals = 18; // Replace with the number of decimals your token uses

    window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: symbol,
          decimals: decimals,
        },
      },
    })
      .then(() => {
        console.log('Token added successfully');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const addLiquidity = async () => {
    window.open("https://testnet.liquishield.exchange/#/pool", "_blank");
  }


  const createToken = async () => {
    if (loadingView) {
      return;
    }
    if (tokenName === "") {
      setSnackbar({
        type: "error",
        message: "Please enter token name.",
      });
      tokenDetailRef.current.focus();
      tokenDetailRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      return;
    }
    if (tokenSymbol === "") {
      setSnackbar({
        type: "error",
        message: "Please enter token symbol.",
      });
      tokenDetailRef.current.focus();
      tokenDetailRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      return;
    }
    if (!isERC20Address(marketingWallet)) {
      setMarketingWallet("");
      setSnackbar({
        type: "error",
        message: "Please enter valid marketing wallet address.",
      });
      addressRef.current.focus();
      addressRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
      return;
    }

    if (
      parseFloat(initialMarketingTax) +
      parseFloat(initialDevelopmentTax) +
      parseFloat(initialLiquidityTax) >
      15 ||
      parseFloat(initialMarketingTax) +
      parseFloat(initialDevelopmentTax) +
      parseFloat(initialLiquidityTax) <
      0
    ) {
      setSnackbar({
        type: "error",
        message: "Please enter valid initial tax.",
      });
      return;
    }
    if (
      parseFloat(finalMarketingTax) +
      parseFloat(finalDevelopmentTax) +
      parseFloat(finalLiquidityTax) >
      5 ||
      parseFloat(finalMarketingTax) +
      parseFloat(finalDevelopmentTax) +
      parseFloat(finalLiquidityTax) <
      0
    ) {
      setSnackbar({
        type: "error",
        message: "Please enter valid final tax.",
      });
      return;
    }

    setLoadingView(true);
    try {
      await handleDeployToken();
    } catch (e) {
      console.log(e);
    }
    setLoadingView(false);
  };

  const handleDeployToken = async () => {

    const _initialTax =
      parseInt(initialMarketingTax) +
      parseInt(parseInt(initialDevelopmentTax) << 16) +
      parseInt(parseInt(initialLiquidityTax) << 8);
    const _finalTax =
      parseInt(finalMarketingTax) +
      parseInt(parseInt(finalDevelopmentTax) << 16) +
      parseInt(parseInt(finalLiquidityTax) << 8);

    const _name = tokenName;
    const _symbol = tokenSymbol;
    const _tokenTotalSupply = tokenSupply;

    const _marketingWallet = marketingWallet;
    const _website = website;
    const _twitter = twitter;
    const _telegram = telegram;

    const arg = [
      _name,
      _symbol,
      _tokenTotalSupply,
      _initialTax,
      _finalTax,
      _marketingWallet,
      _website,
      _twitter,
      _telegram
    ];

    const takingFee = config.takingFee;
    const amountToSend = web3.utils.toWei(takingFee, "ether"); // Convert amount to wei

    const gasPrice = await web3.eth.getGasPrice(); // Retrieve the current gas price

    const maxPriorityFeePerGas =  Math.floor(gasPrice * 0.1);

    
    console.log("******amountToSend(wei)", amountToSend, maxPriorityFeePerGas);

    const result = await contract.methods.deployToken(...arg).send({
      from: address, value: amountToSend,
      gasPrice: gasPrice,
      maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
    })
      .on('transactionHash', (hash) => {
        console.log('Transaction hash:', hash);
        setSnackbar({
          type: "success",
          message: "Deploying new token... 👍",
        });
      })
      .on('receipt', (receipt) => {
        console.log('Transaction receipt:', receipt);
        if (receipt.status) {
          setTokenReceipt(receipt);
          setSnackbar({
            type: "success",
            message: "Success for deploying new token! 👍",
          });
          InitializeTokenValues();
        }
      })
      .on('error', (error) => {
        console.error('Error:', error);
        setSnackbar({
          type: "error",
          message: "Failed for deploying new token! 👍",
        });
      })
    console.log('************Trasaciont result', result);
  }

  // const transferFee = async () => {
  //   const recipientAddress = config.takingWalletAddress;
  //   const takingFee = config.takingFee;
  //   const amountToSend = web3.utils.toWei(takingFee, "ether"); // Convert amount to wei
  //   const gasEstimate = await web3.eth.estimateGas({
  //     from: address,
  //     to: recipientAddress,
  //     value: web3.utils.toWei(takingFee, "ether"),
  //   });

  //   console.log("*******gas fee", gasEstimate);
  //   const receipt = await web3.eth.sendTransaction({
  //     from: address,
  //     to: recipientAddress,
  //     value: amountToSend,
  //     gas: gasEstimate,
  //   });

  //   console.log("**********Receipt for transfer", receipt);

  //   if (receipt?.status) {
  //     setSnackbar({
  //       type: "success",
  //       message: "success ! 0.1ETH transferred for deploying new token! 👍`",
  //     });
  //     await handleCreateToken();
  //   } else {
  //     setSnackbar({
  //       type: "error",
  //       message: "failed for deploying new token! 👍",
  //     });
  //   }
  // };

  // const handleCreateToken = async (e) => {
  //   try {
  //     let tokenContract = new web3.eth.Contract(abi);

  //     if (!address) {
  //       setSnackbar({
  //         type: "error",
  //         message: "error ! connect wallet! 👍",
  //       });
  //       return;
  //     }

  //     console.log(
  //       "*******values",
  //       initialMarketingTax,
  //       initialDevelopmentTax,
  //       initialLiquidityTax
  //     );

  //     const initialTax =
  //       parseInt(initialMarketingTax) +
  //       parseInt(parseInt(initialDevelopmentTax) << 16) +
  //       parseInt(parseInt(initialLiquidityTax) << 8);
  //     const finalTax =
  //       parseInt(finalMarketingTax) +
  //       parseInt(parseInt(finalDevelopmentTax) << 16) +
  //       parseInt(parseInt(finalLiquidityTax) << 8);

  //     const _name = tokenName;
  //     const _symbol = tokenSymbol;
  //     const _tokenTotalSupply = tokenSupply;

  //     const _initialBuyTax = initialTax;
  //     const _initialSellTax = initialTax;
  //     const _finalBuyTax = finalTax;
  //     const _finalSellTax = finalTax;

  //     const _marketingWallet = marketingWallet;
  //     const _website = website;
  //     const _twitter = twitter;
  //     const _telegram = telegram;

  //     const arg = [
  //       _name,
  //       _symbol,
  //       _tokenTotalSupply,
  //       _initialBuyTax,
  //       _initialSellTax,
  //       _finalBuyTax,
  //       _finalSellTax,
  //       _marketingWallet,
  //       _website,
  //       _twitter,
  //       _telegram,
  //     ];

  //     console.log("***********Tax", initialTax, finalTax, arg);

  //     await tokenContract
  //       .deploy({
  //         data: tokenByte["ERC20Token"],
  //         arguments: arg,
  //       })
  //       .send(
  //         {
  //           from: address,
  //         },
  //         function (error, transactionHash) {
  //           if (transactionHash != undefined)
  //             setSnackbar({
  //               type: "success",
  //               message: "Waiting for confirmation 👌",
  //             });
  //         }
  //       )
  //       .on("error", function (error) {
  //         setSnackbar({
  //           type: "error",
  //           message: "error ! something went wrong! 👍",
  //         });
  //         console.log("******deployed failed", error);
  //       })
  //       .on("receipt", (receipt) => {
  //         setSnackbar({
  //           type: "success",
  //           message: "success ! your last transaction is success 👍",
  //         });
  //         console.log(
  //           "******deployed success:" + receipt.contractAddress,
  //           receipt
  //         );
  //         window.open(
  //           "https://goerli.etherscan.io/address/" + receipt.contractAddress,
  //           "_blank"
  //         );
  //       });
  //   } catch (err) {
  //     setSnackbar({
  //       type: "error",
  //       message: "error ! something went wrong! 👍",
  //     });
  //   }
  // };

  return (
    <Box>
      <Header />
      <Container>
        <Box
          sx={{
            marginTop: "20px",
            border: "1px solid transparent",
            position: "relative",
            width: "100%",
            height: "64px",
          }}
        >
          <Divider
            sx={{
              margin: "32px 0",
              borderColor: "#1F262F",
              background: "#030B15",
            }}
          />
          <ScrollLink
            to="token-create"
            smooth={true}
            duration={500}
            offset={-64}
            spy={true}
            exact="true"
            activeClass="active"
            className="scroll-link"
            style={{
              position: "absolute",
              top: "0",
              left: "calc(50% - 32px)",
              width: "64px",
              height: "64px",
              borderRadius: "32px",
              border: "1px solid #1F262F",
              background: "#030B15",
              color: "#1F262F",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <SouthIcon />
          </ScrollLink>
        </Box>
        <Box
          sx={{
            display: address ? "none" : "flex",
            flexDirection: "column",
            paddingTop: { sm: "50px", xs: "50px" },
          }}
        >
          <Typography
            sx={{
              color: "#00C1F0",
              textAlign: "center",
              fontSize: { md: "20px", sm: "18px", xs: "14px" },
            }}
          >
            You must connect wallet to create token.
          </Typography>
        </Box>
        <Box
          id="token-create"
          sx={{
            display: address ? "flex" : "none",
            flexDirection: "column",
            paddingTop: { sm: "50px", xs: "30px" },
          }}
        >
          <Box ref={tokenDetailRef}>
            <SubTitle
              title={"Token Details"}
              description={"Enter token details and choose a network"}
            />
            <Box sx={{ ...GRID_6_STYLE, marginTop: "40px" }}>
              <Box>
                <EditBox
                  title={"Token Name"}
                  placeholder={"Enter your token name"}
                  value={tokenName}
                  onChangeContent={(value) => setTokenName(value)}
                  inputProps={{ maxLength: 32 }}
                  isOptional={false}
                  isDisable={false}
                  isNumberType={false}
                />
              </Box>
              <Box>
                <EditBox
                  title={"Token Symbol"}
                  placeholder={"Enter your token symbol"}
                  value={tokenSymbol}
                  onChangeContent={(value) => setTokenSymbol(value)}
                  inputProps={{ maxLength: 12 }}
                  isOptional={false}
                  isDisable={false}
                  isNumberType={false}
                />
              </Box>
            </Box>
            <Box
              sx={{
                marginTop: "20px",
              }}
            >
              <EditBox
                title={"Token Supply"}
                placeholder={"Min: 1"}
                value={tokenSupply}
                onChangeContent={(value) =>
                  setTokenSupply(value < 1 ? 1 : value)
                }
                inputProps={{ min: 0 }}
                isOptional={false}
                isDisable={false}
                isNumberType={true}
              />
            </Box>
          </Box>
          <Box
            ref={addressRef}
            sx={{
              marginTop: "100px",
            }}
          >
            <SubTitle
              title={"Wallet & DEX Address"}
              description={
                "Let us know your wallet information and dex address"
              }
            />
            <Box sx={{ ...GRID_6_STYLE, marginTop: "40px" }}>
              <Box>
                <EditBox
                  title={"Max Wallet"}
                  placeholder={""}
                  value={maxWallet}
                  onChangeContent={(value) => setMaxWallet(value)}
                  inputProps={{}}
                  isOptional={true}
                  isDisable={true}
                  isNumberType={false}
                />
              </Box>
              <Box>
                <EditBox
                  title={"Marketing Wallet"}
                  placeholder={""}
                  value={marketingWallet}
                  onChangeContent={(value) => setMarketingWallet(value)}
                  inputProps={{}}
                  isOptional={false}
                  isDisable={false}
                  isNumberType={false}
                />
              </Box>
            </Box>
            <Box sx={{ ...GRID_6_STYLE, marginTop: "20px" }}>
              <Box>
                <EditBox
                  title={"Max Transaction"}
                  placeholder={""}
                  value={maxTransaction}
                  onChangeContent={(value) => setMaxTransaction(value)}
                  inputProps={{}}
                  isOptional={true}
                  isDisable={true}
                  isNumberType={false}
                />
              </Box>
              <Box>
                <EditBox
                  title={"Development Wallet"}
                  placeholder={""}
                  value={developmentWallet}
                  onChangeContent={(value) => setDevelopmentWallet(value)}
                  inputProps={{}}
                  isOptional={true}
                  isDisable={true}
                  isNumberType={false}
                />
              </Box>
            </Box>
            <Box sx={{ ...GRID_6_STYLE, marginTop: "20px" }}>
              <Box>
                <EditBox
                  title={"Router DEX Address"}
                  placeholder={""}
                  value={routerDexAddress}
                  onChangeContent={(value) => setRouterDexAddress(value)}
                  inputProps={{}}
                  isOptional={true}
                  isDisable={true}
                  isNumberType={false}
                />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              marginTop: { sm: "100px", xs: "80px" },
            }}
          >
            <SubTitle
              title={"Contact Information"}
              description={"Enter social links to show your tokenomics"}
            />
            <Box sx={{ ...GRID_6_STYLE, marginTop: "40px" }}>
              <Box>
                <EditBox
                  title={"Website"}
                  placeholder={"https://yourwebsite.com"}
                  value={website}
                  onChangeContent={(value) => setWebsite(value)}
                  inputProps={{}}
                  isOptional={true}
                  isDisable={false}
                  isNumberType={false}
                />
              </Box>
              <Box>
                <EditBox
                  title={"Telegram"}
                  placeholder={"https://t.me/@"}
                  value={telegram}
                  onChangeContent={(value) => setTelegram(value)}
                  inputProps={{}}
                  isOptional={true}
                  isDisable={false}
                  isNumberType={false}
                />
              </Box>
            </Box>
            <Box sx={{ ...GRID_6_STYLE, marginTop: "20px" }}>
              <Box>
                <EditBox
                  title={"Twitter"}
                  placeholder={"https://twitter.com/@"}
                  value={twitter}
                  onChangeContent={(value) => setTwitter(value)}
                  inputProps={{}}
                  isOptional={true}
                  isDisable={false}
                  isNumberType={false}
                />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              marginTop: { sm: "100px", xs: "80px" },
            }}
          >
            <SubTitle
              title={"Tax"}
              description={"Set the inital & final Tax you want"}
            />
            <Box
              sx={{
                ...GRID_4_STYLE,
                marginTop: "40px",
              }}
            >
              <Typography
                sx={{
                  position: "absolute",
                  left: "50px",
                  top: "-14px",
                  padding: "0 5px",
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "white",
                  background: "#030b15",
                }}
              >
                Initial Tax
              </Typography>
              <Box>
                <EditBox
                  title={"Marketing"}
                  placeholder={"0%"}
                  value={initialMarketingTax}
                  onChangeContent={(value) => {
                    const floorValue = value ? Math.floor(value) : value;
                    setInitialMarketingTax(
                      floorValue > 15 ? 15 : floorValue < 0 ? 0 : floorValue
                    )
                  }
                  }
                  inputProps={{ min: 0 }}
                  isOptional={true}
                  isDisable={false}
                  isNumberType={true}
                />
              </Box>
              <Box>
                <EditBox
                  title={"Development"}
                  placeholder={"0%"}
                  value={initialDevelopmentTax}
                  onChangeContent={(value) => {
                    const floorValue = value ? Math.floor(value) : value;
                    setInitialDevelopmentTax(
                      floorValue > 15 ? 15 : floorValue < 0 ? 0 : floorValue
                    )
                  }
                  }
                  inputProps={{ min: 0 }}
                  isOptional={true}
                  isDisable={false}
                  isNumberType={true}
                />
              </Box>
              <Box>
                <EditBox
                  title={"Liquidity Pool"}
                  placeholder={"0%"}
                  value={initialLiquidityTax}
                  onChangeContent={(value) => {
                    const floorValue = value ? Math.floor(value) : value;
                    setInitialLiquidityTax(
                      floorValue > 15 ? 15 : floorValue < 0 ? 0 : floorValue
                    )
                  }
                  }
                  inputProps={{ min: 0 }}
                  isOptional={true}
                  isDisable={false}
                  isNumberType={true}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: { sm: "16px", xs: "14px" },
                  width: {
                    md: "calc(100% - 100px)",
                    sm: "calc(100% - 60px)",
                    xs: "calc(100% - 40px)",
                  },
                  position: "absolute",
                  bottom: { xs: "30px" },
                  color: "#ffffff80",
                }}
              >
                Initial Tax cannot be greater than 15%.
              </Typography>
            </Box>
            <Box
              sx={{
                ...GRID_4_STYLE,
                marginTop: "40px",
              }}
            >
              <Typography
                sx={{
                  position: "absolute",
                  left: "50px",
                  top: "-14px",
                  padding: "0 5px",
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "white",
                  background: "#030b15",
                }}
              >
                Final Tax
              </Typography>
              <Box>
                <EditBox
                  title={"Marketing"}
                  placeholder={"0%"}
                  value={finalMarketingTax}
                  onChangeContent={(value) => {
                    const floorValue = value ? Math.floor(value) : value;
                    setFinalMarketingTax(floorValue > 5 ? 5 : floorValue < 0 ? 0 : floorValue)
                  }
                  }
                  inputProps={{ min: 0 }}
                  isOptional={true}
                  isDisable={false}
                  isNumberType={true}
                />
              </Box>
              <Box>
                <EditBox
                  title={"Development"}
                  placeholder={"0%"}
                  value={finalDevelopmentTax}
                  onChangeContent={(value) => {
                    const floorValue = value ? Math.floor(value) : value;
                    setFinalDevelopmentTax(floorValue > 5 ? 5 : floorValue < 0 ? 0 : floorValue)
                  }
                  }
                  inputProps={{ min: 0 }}
                  isOptional={true}
                  isDisable={false}
                  isNumberType={true}
                  type="number"
                />
              </Box>
              <Box>
                <EditBox
                  title={"Liquidity Pool"}
                  placeholder={"0%"}
                  value={finalLiquidityTax}
                  onChangeContent={(value) => {
                    const floorValue = value ? Math.floor(value) : value;
                    setFinalLiquidityTax(floorValue > 5 ? 5 : floorValue < 0 ? 0 : floorValue)
                  }
                  }
                  inputProps={{ min: 0 }}
                  isOptional={true}
                  isDisable={false}
                  isNumberType={true}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: { sm: "16px", xs: "14px" },
                  width: {
                    md: "calc(100% - 100px)",
                    sm: "calc(100% - 60px)",
                    xs: "calc(100% - 40px)",
                  },
                  position: "absolute",
                  bottom: { xs: "30px" },
                  color: "#ffffff80",
                }}
              >
                Final Tax cannot be greater than 5%.
              </Typography>
            </Box>
          </Box>
          <Typography
            sx={{
              marginTop: "20px",
              fontSize: { sm: "18px", xs: "16px" },
              color: "#ffffff80",
              fontWeight: "600",
            }}
          >
            A fixed 0.1ETH will be charged for creating the token. Please make
            sure you have enough ETH to cover the fee + gas cost.
          </Typography>
          <Box
            sx={{
              marginTop: { sm: "80px", xs: "50px" },
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              onClick={() => createToken()}
              sx={{
                width: { md: "225px", sm: "200px", xs: "180px" },
                height: { md: "56px", sm: "52px", xs: "48px" },
                borderRadius: "32px",
                fontSize: { md: "18px", sm: "16px", xs: "14px" },
                fontWeight: "700",
                background: "#00C1F0",
                textTransform: "none",
                color: "white",
                ":hover": {
                  background: "#FFC1F0",
                },
              }}
            >
              Create a Token
            </Button>
          </Box>
        </Box>

        <Box
          id="token-info"
          sx={{
            backgroundColor: "#0B1D33",
            display: tokenReceipt ? "flex" : "none",
            flexDirection: "column",
            marginTop: { sm: "50px", xs: "30px" },
            paddingX: { sm: "50px", xs: "30px" },
            paddingY: { sm: "50px", xs: "30px" },
            borderRadius: "5px"
          }}
        >
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: "17px", paddingY: "30px" }}>
            <Typography
              sx={{
                color: "#48EF8B",
                fontSize: { sm: "30px", xs: "20px" },
                fontWeight: "600",
              }}
            >
              Well! Transaction Done!
            </Typography>
            <Typography
              sx={{
                color: "#fff",
                fontSize: { sm: "16px", xs: "14px" },
                fontWeight: "400",
                overflowWrap: "anywhere"
              }}
            >
              Transaction Hash: {tokenReceipt.transactionHash}
            </Typography>
          </Box>
          <Divider sx={{ backgroundColor: "#2E5281" }} />
          <Box sx={{ display: "flex", flexDirection: { sm: "row", xs: "column" }, gap: "30px", paddingY: "30px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "17px" }}>
              <Typography
                sx={{
                  color: "#FFF",
                  fontSize: { sm: "20px", xs: "14px]" },
                  fontWeight: "600",
                }}
              >
                YOUR TOKEN
              </Typography>
              <Typography
                sx={{
                  color: "#FFF",
                  fontSize: { sm: "30px", xs: "20px" },
                  fontWeight: "500",
                }}
              >
                {`${tokenName} (${tokenSymbol})`}
              </Typography>
            </Box>
            <Divider sx={{ backgroundColor: "#2E5281", display: { sm: "hidden", xs: "block" } }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: "17px" }}>
              <Typography
                sx={{
                  color: "#FFF",
                  fontSize: { sm: "20px", xs: "14px]" },
                  fontWeight: "600",
                }}
              >
                TOTAL SUPPLY
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", gap: "17px", alignItems: "center" }}>
                <Typography
                  sx={{
                    color: "#FFF",
                    fontSize: { sm: "30px", xs: "20px" },
                    fontWeight: "500",
                  }}
                >
                  {tokenSupply}
                </Typography>

                <Typography sx={{
                  color: "#48EF8B",
                  fontSize: "14px",
                  fontWeight: "700",
                }}>{tokenSymbol}</Typography>
              </Box>
            </Box>
            <Divider sx={{ backgroundColor: "#2E5281", display: { sm: "hidden", xs: "block" } }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: "17px" }}>
              <Typography
                sx={{
                  color: "#FFF",
                  fontSize: { sm: "20px", xs: "14px]" },
                  fontWeight: "600",
                }}
              >
                ADDRESS
              </Typography>
              <Typography
                sx={{
                  color: "#FFF",
                  fontSize: { sm: "20px", xs: "14px" },
                  fontWeight: "600",
                  overflowWrap: "anywhere"

                }}
              >
                {tokenReceipt?.events && tokenReceipt?.events["6"].address}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: { sm: "row", xs: "column" }, gap: "17px" }}>
            <Button
              onClick={() => addMetamask(tokenReceipt?.events && tokenReceipt?.events["6"].address)}
              sx={{
                paddingX: "20px",
                height: { md: "56px", sm: "52px", xs: "48px" },
                borderRadius: "32px",
                fontSize: { md: "18px", sm: "16px", xs: "14px" },
                fontWeight: "700",
                background: "#FF7020",
                textTransform: "none",
                color: "black",
                ":hover": {
                  background: "#FFC1F0",
                },
              }}
            >
              Add To MetaMask
            </Button>
            <Button
              onClick={() => addLiquidity()}
              sx={{
                paddingX: "20px",
                height: { md: "56px", sm: "52px", xs: "48px" },
                borderRadius: "32px",
                fontSize: { md: "18px", sm: "16px", xs: "14px" },
                fontWeight: "700",
                background: "#00C1F0",
                textTransform: "none",
                color: "black",
                ":hover": {
                  background: "#FFC1F0",
                },
              }}
            >
              Add Liquidity on LiquiShield
            </Button>
          </Box>
          <Box ref={infoRef}></Box>
        </Box>
      </Container >
      <Dialog
        open={loadingView}
        sx={{
          ".MuiPaper-root": {
            background: "transparent",
            boxShadow: "none",
            overflow: "hidden",
            margin: "0",
            padding: "0",
          },
        }}
      >
        <Loading />
      </Dialog>
    </Box >
  );
}

export default Home;

const GRID_6_STYLE = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  ".MuiBox-root": {
    width: {
      md: "calc(50% - 30px)",
      sm: "calc(50% - 20px)",
      xs: "calc(50% - 10px)",
    },
  },
};

const GRID_4_STYLE = {
  position: "relative",
  width: "100%",
  maxWidth: "1000px",
  borderRadius: "12px",
  padding: {
    md: "50px 50px 80px",
    sm: "50px 30px 80px",
    xs: "20px 20px 70px",
  },
  border: "1px solid #172331",
  display: "flex",
  flexDirection: { sm: "row", xs: "column" },
  alignItems: "center",
  justifyContent: "space-between",
  ".MuiBox-root": {
    marginTop: "10px",
    width: {
      md: "calc(30% - 10px)",
      sm: "30%",
      xs: "100%",
    },
  },
};
