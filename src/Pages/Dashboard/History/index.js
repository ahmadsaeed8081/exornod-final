import React, { useState, useEffect } from "react";
import Layout from "../../../routes/Layout";
import DropDown from "../../../components/DropDown_swap";
import { ArrowDownIcon_swap } from "../../../assets/Icons";

import Web3 from "web3";


import { useContractReads,useContractRead ,useContractWrite, usePrepareContractWrite, useWaitForTransaction, usePublicClient } from 'wagmi'
import {useNetwork,  useSwitchNetwork } from 'wagmi'
import { useAccount, useDisconnect } from 'wagmi'

import {
  Swap_cont_address,
  Swap_cont_abi,
  token_abi,
  EXOR_Address,
  EXOR_v2_Address
} from "../../../components/config";


const History = (props) => {





  const [send_token_amount, set_send_token_amount] = useState("");
  const [recieve_token_amount, set_recieve_token_amount] = useState("");




  const { address, isConnecting ,isDisconnected} = useAccount()
  const { chain } = useNetwork()

  const [Expected_return, set_Expected_return] = useState(0);





  const CHAIN_ID = "137";
  const CHAIN_ID1 = "0x89";


  const {
    data: swapResult,
    isLoading: isLoading_swap,
    isSuccess: swapSuccess,
    write: token_to_token,
  } = useContractWrite({
    address: Swap_cont_address,
    abi: Swap_cont_abi,
    functionName: 'swap_token',
    args: [Convert_To_Wei(send_token_amount?(send_token_amount):("0"))],
    onSuccess(data) {
      props.mount();
      console.log('Success', data)
    },
  });








  
  const { config: EXOR_Config } = usePrepareContractWrite({
    address: EXOR_Address,
    abi: token_abi,
    functionName: "approve",
    args: [Swap_cont_address,Convert_To_Wei((send_token_amount?(send_token_amount):("0")))],
  });






  const {
    data: data_token,
    isLoading: isLoading_token,
    isSuccess: isSuccess_token,
    write: approval_token,
    } = useContractWrite(EXOR_Config);
    




const {switchNetwork:swap_switch_EXOR } =
useSwitchNetwork({
  chainId: CHAIN_ID1,
  // throwForSwitchChainNotSupported: true,
  onSuccess(){

    approval_token?.();
  }

  

})










const waitForTransaction_sell = useWaitForTransaction({
  hash: data_token?.hash,
  onSuccess(data) {
    token_to_token?.();
    console.log("Success", data);
  },
});


function Convert_To_Wei(val) {
  const web3= new Web3(new Web3.providers.HttpProvider("https://polygon.meowrpc.com"));

  val = web3.utils.toWei(val.toString(), "ether");
  return val;
}






function swap()
{
      if(isDisconnected)
      {
        alert("Kindly connect your wallet");
        return;
      }
      if(send_token_amount=="" || send_token_amount=="0")
      {
        alert("Kidly write the amount");
        return;
      }
      
      if(Number(props.EXOR_Balance)< Number(Convert_To_Wei(send_token_amount)))
      {
        alert("You don't have enough EXOR");
        return;
      }

      if(CHAIN_ID!=chain.id)
      {
        swap_switch_EXOR?.();
      }
      else{
        approval_token?.()
      }
  }
  








  return (
    <Layout>
      <div className="bg-[#101010] min-h-screen items-center justify-center flex">

      <div className="wrap wrapWidth flex items-center justify-center">
          <div className="page-block flex flex-col">
            <div className="page-hdr flex items-center justify-center flex-col">
              {/* <p className="page-desc">
                Users can swap Exor token in to EXOR v1 Token
              </p> */}
            </div>
            <div className="swap-box flex flex-col">
              <label className="box-lbl mb-2">Swap</label>
              <div className="pay-block flex flex-col items-center justify-center relative">
                <div className="pay-section flex items-center">
                  <div className="left flex flex-col">
                    <div className="input-field flex flex-col">
                      <label className="field-lbl">You pay</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="txt cleanbtn w-1/2 my-2"
                        value={send_token_amount}
                        onChange={(e)=>{
                           set_send_token_amount( e.target.value);
                           set_recieve_token_amount(e.target.value);

                        }}  
                        
                      />
                      <h1 className="val">{}</h1>
                    </div>
                  </div>
                  <div className="right flex items-center">


                  <div className="dropDown flex aic flex-col rel ">
                    <div className="category flex aic">
                      <div className="cbox cleanbtn flex aic rel pointer" >
                        <div className="slt flex items-center w-full">
                          <div className="unit-name flex items-center w-full">
                            <span className="unit-eng flex items-center w-full">
                              EXOR
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

  
                  </div>
                </div>
                <div className="arrow-down-icon absolute  flex items-center justify-center">
                  <ArrowDownIcon_swap />
                </div>
                <div className="pay-section flex items-center" >
                  <div className="left flex flex-col">
                    <div className="input-field flex flex-col">
                      <label className="field-lbl">You Receive</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="txt cleanbtn w-1/2 my-2"
                        value={recieve_token_amount}
                        onChange={(e)=>{
                           set_recieve_token_amount(e.target.value);
                           send_token_amount(e.target.value)
                           
                           
                        }}  
                      />
                    </div>
                  </div>
                  <div className="right flex items-center" >
                     

                  <div className="dropDown flex aic flex-col rel ">
                    <div className="category flex aic">
                      <div className="cbox cleanbtn flex aic rel pointer" >
                        <div className="slt flex items-center w-full">
                          <div className="unit-name flex items-center w-full">
                            <span className="unit-eng flex items-center w-full">
                              EXOR V1
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>



                  </div>
                  </div>
                </div>
              </div>

              <button className="btn-connect button" style={{ marginTop:"30px" , color:"black",fontWeight:"600" }} onClick={swap}>Swap</button>

            </div>
          </div>
        
      </div>
    </Layout>
  );
                      };

export default History;
