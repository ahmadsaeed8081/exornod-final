import React, { useState, useEffect } from "react";
import Layout from "../../../routes/Layout";
import {
  ArrowRightIconC,
  DaiBIcon,
  DaiIcon,
  DbIcon,
} from "../../../assets/Icons";
import Loader from "../../../components/Loader";


import {useNetwork,  useSwitchNetwork } from 'wagmi'
import { useAccount, useDisconnect } from 'wagmi'
import { cont_address,USDT_Address,DAI_Address,EXOR_v2_Address,NOD_Address,token_abi,NFT_abi,cont_abi } from "../../../components/config";
import { useContractReads,useContractRead ,useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import Web3 from "web3";


const PurchaseToken = (props) => {
  const [totalAmount, set_totalAmount] = useState(props.PerNodePrice);
  const [number, setNumber] = useState(0);
  const [withoutdiscount_Amount, set_withoutdiscount_Amount] = useState(0);

  
  const [show, setShow] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState({
    lbl: "USDT (Polygon)",
    value: Number(props.USDT_Balance)/10**6,
    id:"1",
  });
  useEffect(() => {
    document.addEventListener("click", () => {
      setShow(false);

      console.log(props.referral)
    });
  }, []);

// useEffect(()=>{console.log("objecthelo");},[props.totalNodsold])

  const networkId=137;

  const { address, isConnecting ,isDisconnected} = useAccount()
  const { chain } = useNetwork()


  const {switchNetwork:NOdbuy_switch } =
    useSwitchNetwork({
      chainId: networkId,
      onSuccess(){
        if(props.owner.toLowerCase()!=address.toLowerCase())
        {
          if(selectedCurrency.id=="1")
          {
            USDT_approval?.()
  
          }
          else if(selectedCurrency.id=="2")
          {
            DAI_approval?.()
  
          }
          else if(selectedCurrency.id=="3")
          {
            EXOR_approval?.()
  
          }
        }
        else
        {
          Nod_buying_token?.()
        }

      }

    })

    const {switchNetwork:NOdbuyMAtic_switch } =
    useSwitchNetwork({
      chainId: networkId,
      onSuccess(){
        Nod_buying_matic?.()
      }

    })

    const { data:nodToken_Result, isLoading:isLoading_nodToken, isSuccess:nodToken_Success, write:Nod_buying_token } = useContractWrite({

    address: cont_address,
    abi: cont_abi,
    functionName: 'Nod_buying_token',
    args: [address, Number(selectedCurrency.id)-1, number, props.referral],
    onSuccess(data) 
    {
      props.test();
    },
  
  })
  
  const { data:nodMatic_Result, isLoading:isLoading_nodMatic, isSuccess:nodMatic_Success, write:Nod_buying_matic } = useContractWrite({

    address: cont_address,
    abi: cont_abi,
    functionName: 'Nod_buying_matic',
    args: [address, number, props.referral],
    value: props.owner ? (props.owner.toLowerCase() == address.toLowerCase() ? ("0"):(Convert_To_wei(totalAmount))):(null),
    
    onSuccess(data) 
    {
      props.test();
    },
  
  })


  const { config:USDT_Config } = usePrepareContractWrite({

    address: USDT_Address,
    abi: token_abi,
    functionName: 'approve',
    args: [cont_address,Number(totalAmount)*10**6],

  })

  const { config:DAI_Config  } = usePrepareContractWrite({
    
    address: DAI_Address,
    abi: token_abi,
    functionName: 'approve',
    args: [cont_address,Convert_To_wei(totalAmount)],

  })  

  const { config:EXOR_Config  } = usePrepareContractWrite({
    
    address: EXOR_v2_Address,
    abi: token_abi,
    functionName: 'approve',
    args: [cont_address,Convert_To_wei(totalAmount)],

  })

  const {data:data_USDT, isLoading:isLoading_USDT, isSuccess:isSuccess_USDT,write: USDT_approval} = useContractWrite(USDT_Config)
  const {data:data_DAI, isLoading:isLoading_DAI, isSuccess:isSuccess_DAI,write: DAI_approval} = useContractWrite(DAI_Config)
  const {data:data_EXOR, isLoading:isLoading_EXOR, isSuccess:isSuccess_EXOR,write: EXOR_approval} = useContractWrite(EXOR_Config)

  const waitForTransaction = useWaitForTransaction({
    hash: data_USDT?.hash,
    onSuccess(data) {
    Nod_buying_token?.()
      console.log('Success',data )
    },
  })


  const waitForTransaction1 = useWaitForTransaction({
    hash: data_DAI?.hash,
    onSuccess(data) {
    Nod_buying_token?.()
      console.log('Success',data )
    },
  })

  const waitForTransaction2 = useWaitForTransaction({
    hash: data_EXOR?.hash,
    onSuccess(data) {
    Nod_buying_token?.()
      console.log('Success',data )
    },
  })

  function Convert_To_wei( val){
    if(val==null || val==undefined || val=="")
    return 

    const web3= new Web3(new Web3.providers.HttpProvider("https://bsc.publicnode.com	"));
    val= web3.utils.toWei(val.toString(),"ether");
    return val;
  
  }

function BUY_NOD()
{

  if(props.owner.toLowerCase()!=address.toLowerCase())
  {
    if(selectedCurrency.value < Number(totalAmount) )
    {
      alert("You dont have enough Balance")
      return;
    }

  }
  if(number < 1  )
  {
    return;
  }
  if(Number(props.totalNods) <= Number(props.totalNodsold) )
  {
    alert("All NODS has been sold");
    return;
  }
  if(selectedCurrency.lbl=="USDT (Polygon)")
  {
    if(chain.id!=networkId)
    {
      NOdbuy_switch?.();
    }
    else
    {
      if(props.owner.toLowerCase()!=address.toLowerCase())
      {
        USDT_approval?.()

      }
      else{
        Nod_buying_token?.();
      }

    }
  }
  else  if(selectedCurrency.lbl=="DAI (Polygon)" )
  {
    if(chain.id!=networkId)
    {
      NOdbuy_switch?.();
    }
    else
    {
      if(props.owner.toLowerCase()!=address.toLowerCase())
      {
        DAI_approval?.()

      }
      else{
        Nod_buying_token?.();
      }
    }
  }
  else  if(selectedCurrency.lbl=="EXOR (Polygon)")
  {
    if(chain.id!=networkId)
    {
      NOdbuy_switch?.();
    }
    else
    {
      if(props.owner.toLowerCase()!=address.toLowerCase())
      {
        EXOR_approval?.()

      }
      else{
        Nod_buying_token?.();
      }
    }
  }
  else  if(selectedCurrency.lbl == " POL (Polygon)")
  {
    if(chain.id!=networkId)
    {
      NOdbuyMAtic_switch?.();
    }
    else
    {
      Nod_buying_matic?.()
    }
  }

}

function set_TotalPrice(num)
{
  if(selectedCurrency.lbl == "USDT (Polygon)" || selectedCurrency.lbl == "DAI (Polygon)" )
  {
    set_withoutdiscount_Amount( 500 * Number(num) )

   set_totalAmount( Number(props.PerNodePrice)* Number(num))
  }
  else if( selectedCurrency.lbl == " POL (Polygon)")
  {

    set_totalAmount( (Number(props.PerNodePrice_MATIC)/10**18) * Number(num) )
  }
  else if(selectedCurrency.lbl == "EXOR (Polygon)")
  {
    set_withoutdiscount_Amount( 500 * Number(num) )

    set_totalAmount( (Number(props.PerNodePrice)* Number(num))/props.exorPrice)

  }
}








  return (
    <Layout>
      <div className="bg-[#101010] min-h-screen flex">
        <div className="flex w-full px-8 py-28">
          <div className="flex w-full gap-10 flex-col md:flex-row">
            <div className="flex flex-col flex-1 gap-4">
              <div className="bg-black p-5 rounded-sm flex flex-col gap-5">
                <h1 className="text-themeColor zen-dots text-base">
                Founder NOD
                </h1>
                <p className="text-white font-extralight text-sm leading-4">
                 Unlock exclusive benefits by holding your founder nod. Contribute early to projects for rewards. Enjoy transparent, anonymous transactions for full benefits. Maximize your rewards and support projects from the start.

                </p>
              </div>
              <div className="p-5 rounded-sm flex gap-5 border border-[#6B6B6B]">
                <div className="flex flex-col gap-3 w-full">
                  <h1 className="text-themeColor zen-dots text-base">
                    Ownership Transfer
                  </h1>
                  <p className="text-white font-extralight text-sm leading-4">
                  Enjoy hassle-free transfer of exclusive founder NFTs and decentralized founder nod rewards. Transfer ownership effortlessly and receive contribution rewards seamlessly.

                  </p>
                </div>
                <div className="flex items-center justify-center h-36 w-36">
                  <img
                    src="/images/t1.png"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
              <div className="p-5 rounded-sm flex gap-5 border border-[#6B6B6B]">
                <div className="flex flex-col gap-3 w-full">
                  <h1 className="text-themeColor zen-dots text-base">
                  Security  
                  </h1>
                  <p className="text-white font-extralight text-sm leading-4">
                  Exornod leverages Polygon MATIC blockchain, offering secure, decentralized ledger technology with no single point of failure, ensuring robust security and reliability for users' transactions and data

                  </p>
                </div>
                <div className="flex items-center justify-center h-36 w-36">
                  <img
                    src="/images/t2.png"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
              <div className="p-5 rounded-sm flex gap-5 border border-[#6B6B6B]">
                <div className="flex flex-col gap-3 w-full">
                  <h1 className="text-themeColor zen-dots text-base">
                  Limited Supply
                  </h1>
                  <p className="text-white font-extralight text-sm leading-4">
                  Exornod implements a unique upgradable smart contract to enhance the Exornod Ecosystem. It introduces a limited supply of 10,000 Founder NOD and 50 billion EXOR tokens.
                  </p>
                </div>
                <div className="flex items-center justify-center h-36 w-36">
                  <img
                    src="/images/t3.png"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-[0.8]">
              <div className="flex flex-col gap-5 border border-[#727272] h-full w-full rounded-xl">
                <div className="flex flex-col gap-5 w-full p-5">
                  <div className="token-shape-image flex items-center justify-center relative">
                    <img src="/images/t4.png" className="h-36 w-36" />
                    <div className="box-shadow" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-white text-sm">Select Currency</h3>
                    <div className="currency-box relative flex flex-col p-3 bg-[#1e1f20] rounded-2xl border border-t-8 border-[#6B6B6B]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center h-8 w-8">
                            <DaiIcon />
                          </div>
                          <div className="flex flex-col">
                            <h2 className="text-themeColor zen-dots font-normal text-sm">
                              {selectedCurrency.lbl}
                            </h2>
                            <div className="flex items-center gap-1">
                              <p className="text-white text-xs">Balance:</p>
                              <h4 className="zen-dots text-xs text-themeColor">
                                {selectedCurrency.value}
                              </h4>
                            </div>
                          </div>
                        </div>
                        <div
                          className="flex items-center justify-center cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShow(!show);
                          }}
                        >
                          <ArrowRightIconC />
                        </div>
                      </div>
                      {/* Menu show when Click */}
                      <div
                        className={`currency-dropdown-list-menu flex flex-col w-full gap-4 ${
                          show ? "show" : "hide"
                        }`}
                      >
                        <h1 className="text-white zen-dots text-base">
                          Select Payment
                        </h1>
                        <div
                          className="flex items-center bg-white p-3 gap-5 hover:cursor-pointer hover:bg-themeColor"
                          onClick={(e) =>
                            setSelectedCurrency({
                              lbl: "USDT (Polygon)",
                              value: Number(props.USDT_Balance)/10**6,
                              id:"1",
                            })
                          }
                        >
                          <div className="flex items-center justify-center h-8 w-8 ">
                            <DaiBIcon />
                          </div>
                          <div className="flex flex-col w-full gap-1">
                            <h2 className="text-black zen-dots font-light text-sm">
                              USDT (Polygon)
                            </h2>
                            <div className="w-full border-b border-black"></div>
                            <h2 className="text-black zen-dots font-light text-xs">
                              Balance: {Number(props.USDT_Balance)/10**6}
                            </h2>
                          </div>
                        </div>
                        <div
                          className="flex items-center bg-white p-3 gap-5 hover:cursor-pointer hover:bg-themeColor"
                          onClick={(e) =>
                            setSelectedCurrency({
                              lbl: "DAI (Polygon)",
                              value: Number(props.DAI_Balance)/10**18,
                              id:"2",
                            })
                          }
                        >
                          <div className="flex items-center justify-center h-8 w-8 ">
                            <DaiBIcon />
                          </div>
                          <div className="flex flex-col w-full gap-1">
                            <h2 className="text-black zen-dots font-light text-sm">
                              DAI (Polygon)
                            </h2>
                            <div className="w-full border-b border-black"></div>
                            <h2 className="text-black zen-dots font-light text-xs">
                              Balance: {Number(props.DAI_Balance)/10**18}
                            </h2>
                          </div>
                        </div>
                        <div
                          className="flex items-center bg-white p-3 gap-5 hover:cursor-pointer hover:bg-themeColor"
                          onClick={(e) =>
                            setSelectedCurrency({
                              lbl: "EXOR (Polygon)",
                              value: Number(props.EXOR_Balance)/10**18,
                              id:"3",
                            })
                          }
                        >
                          <div className="flex items-center justify-center h-8 w-8 ">
                            <DaiBIcon />
                          </div>
                          <div className="flex flex-col w-full gap-1">
                            <h2 className="text-black zen-dots font-light text-sm">
                              EXOR (Polygon)
                            </h2>
                            <div className="w-full border-b border-black"></div>
                            <h2 className="text-black zen-dots font-light text-xs">
                              Balance: {Number(props.EXOR_Balance)/10**18}
                            </h2>
                          </div>
                        </div>
                        <div
                          className="flex items-center bg-white p-3 gap-5 hover:cursor-pointer hover:bg-themeColor"
                          onClick={(e) =>
                            setSelectedCurrency({
                              lbl: " POL (Polygon)",
                              value: Number(props.MATIC_Balance)/10**18,
                              id:"4",
                            })
                          }
                        >
                          <div className="flex items-center justify-center h-8 w-8 ">
                            <DbIcon />
                          </div>
                          <div className="flex flex-col w-full gap-1">
                            <h2 className="text-black zen-dots font-light text-sm">
                              POL (Polygon)
                            </h2>
                            <div className="w-full border-b border-black"></div>
                            <h2 className="text-black zen-dots font-light text-xs">
                              Balance: {Number(props.MATIC_Balance)/10**18}
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-white text-sm">Price:</p>
                    <h4 className="text-xs text-white font-medium">${Number(props.PerNodePrice)}</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-8 w-8">
                      <DaiIcon />
                    </div>
                    {/* <h4 className="zen-dots text-lg line-through text-white font-medium">
                    {withoutdiscount_Amount} 
                    </h4> */}
                    <h4 className="zen-dots text-lg text-white font-medium">
                    {totalAmount}
                    </h4>
                  </div>
                  {/* <div className="flex flex-col gap-2 p-8">
                 
                 <button className="btn bg-themeColor mt-6 zen-dots text-black font-medium text-lg">
                   40% off
                 </button>
               </div> */}
                </div>
                <div className="flex w-full border-b border-[#343434]"></div>
                <div className="flex flex-col gap-5 w-full p-5">
                  <div className="flex flex-col w-full gap-2">
                    <h3 className="text-white font-light">Quantity:</h3>
                    <div className="flex items-center justify-between border border-themeColor">
                      <button
                        className="bg-themeColor px-5 py-2 font-medium text-xl"
                        onClick={() => {setNumber(number - 1);set_TotalPrice(number - 1)}}
                        disabled={number === 0}
                      >
                        -
                      </button>
                      <p className="flex w-full flex-1 items-center justify-center text-white font-normal text-center">
                        {number}
                      </p>
                      <button
                        className="bg-themeColor px-5 py-2 font-medium text-xl"
                        onClick={() => {setNumber(number + 1);set_TotalPrice(number + 1)}}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center flex-col gap-5">
                    {/* <div className="flex items-center justify-center text-center text-xs text-white px-2 py-1 rounded-full border  border-white w-max">
                      2018 / 7983 REMAIN
                    </div> */}

                    <h1 className="text-white">{Number(props.totalNodsold)} / {Number(props.totalNods)} LEFT IN STOCK</h1>
                  </div>
                </div>
                {/* <div className="flex w-full border-b border-[#343434]"></div> */}
                <div className="flex flex-col gap-4 p-5">
                 
                  <button className="btn bg-themeColor mt-6 zen-dots text-black font-medium text-lg buttonPrimary" onClick={BUY_NOD}>
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {props.loader && <Loader />}

      </div>
    </Layout>
  );
};

export default PurchaseToken;
