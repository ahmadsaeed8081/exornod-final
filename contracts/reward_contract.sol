
// File: @chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol
//SPDX-License-Identifier: MIT


pragma solidity ^0.8.0;

interface AggregatorV3Interface {
  function decimals() external view returns (uint8);

  function description() external view returns (string memory);

  function version() external view returns (uint256);

  function getRoundData(
    uint80 _roundId
  ) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);

  function latestRoundData()
    external
    view
    returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
}

// File: exornod.io/Proxiable.sol



pragma solidity ^0.8.1;

contract Proxiable {
    // Code position in storage is keccak256("PROXIABLE") = "0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7"

    function updateCodeAddress(address newAddress) internal {
        require(
            bytes32(0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7) == Proxiable(newAddress).proxiableUUID(),
            "Not compatible"
        );
        assembly { // solium-disable-line
            sstore(0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7, newAddress)
        }
    }

    function proxiableUUID() public pure returns (bytes32) {
        return 0xc5f16f0fcc639fa48a6947836d9850f504798523bf8c9a3a87d5876cf622bcf7;
    }
} 
// File: exornod.io/exornod_reward.sol



pragma solidity ^0.8.0;



interface TOKEN {
    function transfer(address to, uint tokens) external returns (bool success);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool) ;
    function burnFrom(address sender, uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);

    }
interface NFT {


    function balanceOf(address owner) external view returns (uint256 balance);
    function mint(address _to, uint256 _mintAmount) external;  
    function totalSupply() external view returns (uint256 balance);  
    function tokenOfOwnerByIndex(address owner,uint index) external view returns (uint256 balance);



}

contract Exornod_Reward is Proxiable
    {
        
        struct Nod_data{

            uint buying_time;
            address minter;
            uint withdrawRew;

        }
        
        struct Data{

            bool investBefore;
            mapping(uint=>level_data) level;
            mapping(uint=>burn_data) burn;

            uint totalDirect_rew;
            uint totalDirects;
            bool eligible;
            uint total_burn;
            uint total_withdraw;

            address[] myReferrals;
            address referralFrom;
            uint TotalBurnAmount;

        }

        struct level_data
        {
            uint count; 
            uint earning;
        }

        struct burn_data
        {
            uint amount; 
            uint burnTime;
            uint expire_Time;
            uint apy;
            uint earned_Reward;
            uint pending_Reward;

        }


        AggregatorV3Interface internal priceFeed;
        uint  per_day_divider;
        uint  rewardSupply;
        uint  launchTime;
        uint min_burnAmount;
        uint public exorUsdPrice;


        uint64[5] public levelpercentage;


        mapping(address=>Data) public user;
        mapping(uint=>uint) public perDaySelling;
        mapping(uint=>Nod_data) public nod_data;

        address  EXOR_token; 
        address  NOD_NFT;

        address  USDT_token;
        address  DAI_token;

        address public owner;
        uint public nodPriceInDollar;
        uint public feePriceInDollar;

        uint  directRewPercentage;
        uint public totalusers;
        uint public totalburn;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner is allowed to perform this action");
        _;
    }

            function initalized() public
            {
                require(owner == address(0), "Already initalized");

                per_day_divider= 1 days;
                rewardSupply = 12500000000*10**18;
                launchTime;
                min_burnAmount=25000*10**18;
                exorUsdPrice=0.0003 ether;


                levelpercentage = [5 ether,4 ether,3 ether,2 ether,1 ether];


                EXOR_token = 0x295625d518bF6bb3654b5cC2E226f55Fe78e2e93; 
                NOD_NFT = 0x84B4C46684D60FEF154DD7C4f549e5aD11329CC1;
                USDT_token = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F;
                DAI_token = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;

                nodPriceInDollar=500;
                feePriceInDollar=20 ether;
                directRewPercentage=10;


                launchTime=block.timestamp;
                user[msg.sender].eligible = true;
                owner=msg.sender;
                priceFeed = AggregatorV3Interface(0xAB594600376Ec9fD91F8e885dADF0CE036862dE0); //Mainnet

            }


            function get_nodePrice() public view returns( uint)
            { 
                uint supply = NFT(NOD_NFT).totalSupply();
                if(supply>2000)
                {
                    return nodPriceInDollar + (supply-2000);
                }  
                else{
                    return nodPriceInDollar;
                }

            }

            function get_apyPercentage(uint _amount) internal pure returns( uint)
            { 
                if(_amount>=25000 ether && _amount<=50000 ether)
                {
                    return 0.30556 ether;
                }  
                else if(_amount>50000 ether && _amount<=250000 ether)
                {
                    return 0.3611 ether;
                } 
                else if(_amount>250000 ether && _amount<=750000 ether)
                {
                    return 0.41667 ether;
                } 
                else if(_amount>750000 ether && _amount<=2000000 ether)
                {
                    return 0.55556 ether;
                }
                else if(_amount>2000000 ether && _amount<=10000000 ether)
                {
                    return 0.63889 ether;
                }
                else{
                   return 0;
                }
            }

            function getLatestPrice() public view returns (int) {
            // prettier-ignore
            (
                /* uint80 roundID */,
                int price,
                /*uint startedAt*/,
                /*uint timeStamp*/,
                /*uint80 answeredInRound*/
            ) = priceFeed.latestRoundData();
            return price*10**10;
            }

            function getConversionRate(int dollar_amount) public view returns (int) {

                int MaticPrice = getLatestPrice();
                int maticAmountInUsd = (( dollar_amount*10**18) / (MaticPrice))*10**18;


            return maticAmountInUsd;
            }
            function getConversionRate_fee(int dollar_amount) public view returns (int) {

                int MaticPrice = getLatestPrice();
                int maticAmountInUsd = (( dollar_amount *10**18 ) / (MaticPrice));


            return maticAmountInUsd;
            }

            function getExorRew(uint dollar_amount,uint _no) internal view returns (uint) {
                uint rew ;
                if(_no==0)
                {
                    dollar_amount=dollar_amount*10**12;
                    rew = ( dollar_amount/exorUsdPrice)*10**18;
                }
                else if(_no==1)
                {
                    rew = ( dollar_amount/exorUsdPrice)*10**18;
                }
                else if(_no==2)
                {
                    rew = dollar_amount;

                }
                

            return rew;
            }


            function Nod_buying_matic(address _add, uint _amount, address _ref) payable public returns(bool)
            {
                int totalMatic = getConversionRate(int256(nodPriceInDollar));
                if(msg.sender!=owner)
                {
                    require(uint256(totalMatic) *_amount == msg.value );
                    payable(owner).transfer(msg.value);

                }
                    uint supply = NFT(NOD_NFT).totalSupply();

                return process(_add, supply ,  (nodPriceInDollar * 1 ether) * _amount ,  _amount, _ref,2);                

            }
 
            function Nod_buying_token(address _add, uint _no, uint _amount,address _ref)  public returns(bool)
            {
                uint nodePrice;
                address curr_token;
                if(_no==0){

                    curr_token=USDT_token;
                    nodePrice=(get_nodePrice())*10**6;
                }
                else if(_no==1){

                    curr_token=DAI_token;
                    nodePrice=(get_nodePrice())*10**18;
                }
                else if(_no==2){

                    curr_token=EXOR_token;
                    nodePrice=(get_nodePrice()*10**36)/exorUsdPrice;
                }
                
                if(msg.sender!=owner)
                {                  
                    require(TOKEN(curr_token).allowance(_add,address(this)) >= (nodePrice) * _amount);
                    TOKEN(curr_token).transferFrom(_add,owner,(nodePrice) * _amount);
                }
                uint supply = NFT(NOD_NFT).totalSupply();
                return process(_add, supply ,  nodePrice ,  _amount, _ref,_no);
                
            }

            function process(address _add, uint supply , uint nodePrice , uint _amount,address _ref,uint _no) internal returns(bool)
            {
                for (uint256 i = 1; i <= _amount; i++) {
                    
                    nod_data[supply+i].buying_time=block.timestamp;
                    nod_data[supply+i].minter=_add;

                }
                uint day = (block.timestamp - launchTime)/1 days; 
                perDaySelling[day+1]+=_amount;
                NFT(NOD_NFT).mint(_add,_amount);

                if(user[_add].referralFrom == address(0))
                {
                    if(_ref==address(0) || _ref==_add || _ref==owner || !user[_ref].eligible)
                    {
                        
                        user[_add].referralFrom=owner;
                        _ref=owner;
                        user[_ref].myReferrals.push(_add);
                        if(msg.sender!=owner)
                        {
                            user[_ref].totalDirect_rew += getExorRew((directRewPercentage * ((nodePrice) * _amount))/(100),_no);
                            user[_ref].level[0].count++;
                        }


                    }
                    else 
                    {
                        user[_add].referralFrom=_ref;
                        user[_ref].myReferrals.push(_add);
                        user[_ref].totalDirect_rew += getExorRew((directRewPercentage * ((nodePrice) * _amount))/(100),_no);
                        address temp = _ref;

                        for(uint i=0;i<5;i++)
                        {
                            user[temp].level[i].count++;
                            temp = user[temp].referralFrom;

                            if(temp==address(0))
                            {
                                i=5;
                            }

                        }

                    }                
                }
                else
                {
                    user[user[_add].referralFrom].totalDirect_rew += (directRewPercentage * ((nodePrice) * _amount))/(100*10**18);

                }
                
                if(!user[_add].investBefore)
                {
                    totalusers++; 
                    user[_ref].totalDirects++;
                    user[_add].eligible=true;                                    
                    user[_add].investBefore=true;
                }
                
                return true;

            }


            function burn_token(uint _amount)  public returns(bool)
            {
                require(user[msg.sender].eligible,"not eligible");
                require(TOKEN(EXOR_token).allowance(msg.sender,address(this)) >= _amount);
                require(min_burnAmount <= _amount );

                user[msg.sender].burn[user[msg.sender].total_burn].amount=_amount;
                user[msg.sender].burn[user[msg.sender].total_burn].apy=get_apyPercentage(_amount);

                user[msg.sender].burn[user[msg.sender].total_burn].burnTime=block.timestamp;
                user[msg.sender].burn[user[msg.sender].total_burn].expire_Time = block.timestamp + 360 days;
                user[msg.sender].TotalBurnAmount+=_amount;

                user[msg.sender].total_burn++;
                totalburn+=_amount;

                TOKEN(EXOR_token).burnFrom(msg.sender,_amount);

                return true;
            }



            function get_userRew(address inv)  public view returns(uint rew)
            {
              uint totalNfts = NFT(NOD_NFT).balanceOf(inv);
              for(uint i=0;i<totalNfts;i++)
              {
                    uint nft_no = NFT(NOD_NFT).tokenOfOwnerByIndex(inv,i);
                    rew+=get_nodeRew(nft_no);
              }
            }
            
            function get_nodeRew(uint nft_no)  public view returns(uint rew)
            {
                uint day = (block.timestamp - launchTime)/1 days; 
                
                uint perDayRew;
                uint perPersonRew;
                uint curr_time=launchTime;
                uint totalbuyers;

                for(uint i=1;i<=day;i++)
                {
                    curr_time+=1 days;
                    totalbuyers += perDaySelling[i];
                    if(totalbuyers > 0)
                    {
                        if(i<=360)
                        {
                            perDayRew = (rewardSupply/2)/360;
                            perPersonRew = perDayRew / totalbuyers;
                        }
                        else if(i<=720)
                        {
                            perDayRew = (rewardSupply/4)/360;
                            perPersonRew = perDayRew / totalbuyers;
                        }                    
                        else if(i<1080)
                        {
                            perDayRew = (rewardSupply/8)/360;
                            perPersonRew = perDayRew / totalbuyers;
                        }
                        else if(i<1440)
                        {
                            perDayRew = (rewardSupply/16)/360;
                            perPersonRew = perDayRew / totalbuyers;
                        }                    
                        else if(i<=1800)
                        {
                            perDayRew = (rewardSupply/32)/360;
                            perPersonRew = perDayRew / totalbuyers;
                        }

                    }
                    
                    if(curr_time > nod_data[nft_no].buying_time)
                    {
                        rew+=perPersonRew;
                    }


                }
                rew-=nod_data[nft_no].withdrawRew;

            }


       function getTotalBurnReward(address inv) view public returns(uint){ //this function is get the total reward balance of the investor
            uint totalReward;
            uint depTime;
            uint rew;
            for(uint i=0;i<user[inv].total_burn;i++)
            {
                if(user[inv].burn[i].expire_Time > block.timestamp)
                {
                    depTime =block.timestamp - user[inv].burn[i].burnTime;
                }
                else
                {
                    depTime =user[inv].burn[i].expire_Time - user[inv].burn[i].burnTime;
                }
            
                depTime=depTime/per_day_divider; //1 day
                if(depTime>0)
                {
                    rew  = ((user[inv].burn[i].amount)*get_apyPercentage(user[inv].burn[i].amount))/100000000000000000000;

                    totalReward += depTime * rew;

                }
            }
            
            
            return totalReward;
        }

        function getLevelReward_perInv(uint i,address inv,address main) view public returns(uint)
        {
            uint totalReward;
            uint depTime;
            uint rew;

                if(user[main].eligible)
                {
                    
                    if(block.timestamp < user[inv].burn[i].expire_Time)
                    {
                        depTime =block.timestamp - user[inv].burn[i].burnTime;
                    }
                    else
                    {    
                        depTime =user[inv].burn[i].expire_Time - user[inv].burn[i].burnTime;
                    }                        
                
                }
                
                depTime=depTime/per_day_divider; //1 day
                if(depTime>0)
                {
                rew  = ((user[inv].burn[i].amount)*get_apyPercentage(user[inv].burn[i].amount))/100000000000000000000;


                    totalReward = depTime * rew;
                }
            

            return totalReward;
        }



        function perBurn_Reward(uint i,address inv) view public returns(uint)
        {
            uint totalReward;
            uint depTime;
            uint rew;

                    
            if(block.timestamp < user[inv].burn[i].expire_Time)
            {
                depTime =block.timestamp - user[inv].burn[i].burnTime;
            }
            else
            {    
                depTime =user[inv].burn[i].expire_Time - user[inv].burn[i].burnTime;
            }                        
                                
            depTime=depTime/per_day_divider; //1 day
            if(depTime>0)
            {
            rew  = ((user[msg.sender].burn[i].amount)*get_apyPercentage(user[msg.sender].burn[i].amount))/100000000000000000000;


                totalReward = depTime * rew;
            }
            

            return totalReward;
        }

        function RefLevel_earning(address inv) public view returns( uint[] memory arr1 )
        { 

            uint[] memory levelRewards = new uint[](5);

            uint calc_rew; 
            address[] memory direct_members = user[inv].myReferrals;
            uint next_member_count;

            for(uint j=0; j < 5;j++) //levels
            {

                if(user[inv].eligible)
                {
                    for( uint k = 0;k < direct_members.length;k++) //members
                    {   
                        
                        next_member_count+=user[direct_members[k]].myReferrals.length;

                        uint temp = user[direct_members[k]].total_burn; 

                        for( uint i = 0;i < temp;i++) //burns
                        {   
                            uint temp_amount = getLevelReward_perInv(i,direct_members[k],inv);
                            calc_rew +=  ((temp_amount * (levelpercentage[j]) )/ (100*10**18) );
                            
                        }
                                    
                    }
                    levelRewards[j]=calc_rew;
                    calc_rew=0;

                    address[] memory next_members=new address[](next_member_count) ;

                    for( uint m = 0;m < direct_members.length;m++) //members
                    {   
                        for( uint n = 0; n < user[direct_members[m]].myReferrals.length; n++) //members
                        {   
                            next_members[calc_rew]= user[direct_members[m]].myReferrals[n];
                            calc_rew++;
                        }
                    }
                    direct_members=next_members; 
                    next_member_count=0;
                    calc_rew=0;


                }
                
            }

            return levelRewards;
        }

        function Level_count(address inv) public view returns( uint[] memory _arr )
        {
            uint[] memory referralLevels_count=new uint[](5);

            for(uint i=0;i<5;i++)
            {
                referralLevels_count[i] = user[inv].level[i].count;
            }
            return referralLevels_count ;


        }
        function get_totalEarning() public view returns(uint) {
            
            uint[] memory arr= new uint[](5);
                
            arr=RefLevel_earning(msg.sender);

            uint total_levelReward;
            for(uint i=0;i<5;i++)
            {
                total_levelReward+=arr[i];
            }

           return user[msg.sender].totalDirect_rew + total_levelReward + getTotalBurnReward(msg.sender) + get_userRew(msg.sender) + user[msg.sender].total_withdraw;

        }

        function get_availableBalance() public view returns(uint) {
            
            uint[] memory arr= new uint[](5);
                
            arr=RefLevel_earning(msg.sender);

            uint total_levelReward;
            for(uint i=0;i<5;i++)
            {
                total_levelReward+=arr[i];
            }

           return  ((user[msg.sender].totalDirect_rew + total_levelReward + getTotalBurnReward(msg.sender) + get_userRew(msg.sender)) - user[msg.sender].total_withdraw);

        }

        function activate_Ref(address _ref) public payable returns(bool) {

            require(!user[msg.sender].eligible,"already eligible");
            int total_matic=getConversionRate_fee(int256(feePriceInDollar));
            require( msg.value >= uint256(total_matic));
            payable(owner).transfer(msg.value);
            user[msg.sender].eligible = true;

            if(_ref==address(0) || _ref==msg.sender || _ref==owner || !user[_ref].eligible)
            {
                
                user[msg.sender].referralFrom=owner;
                _ref=owner;
                user[_ref].myReferrals.push(msg.sender);
                user[_ref].level[0].count++;

            }
            else 
            {
                user[msg.sender].referralFrom=_ref;
                user[_ref].myReferrals.push(msg.sender);
                address temp = _ref;

                for(uint i=0;i<5;i++)
                {
                    user[temp].level[i].count++;
                    temp = user[temp].referralFrom;

                    if(temp==address(0))
                    {
                        i=5;
                    }

                }

            }         




            return true;

        }


        function withdrawReward() external returns (bool success)
        {
            uint[] memory arr= new uint[](12);
                
            arr=RefLevel_earning(msg.sender);

            uint total_levelReward;
            for(uint i=0;i<5;i++)
            {
                total_levelReward+=arr[i];
            }

            uint burnRew=getTotalBurnReward(msg.sender);
            uint nodeRew=get_userRew(msg.sender);

            uint Total_reward=(total_levelReward+burnRew+nodeRew)-user[msg.sender].total_withdraw;
            user[msg.sender].total_withdraw+=Total_reward;
            uint totalNfts = NFT(NOD_NFT).balanceOf(msg.sender);
            for(uint i=0;i<totalNfts;i++)
            {
                uint nft_no = NFT(NOD_NFT).tokenOfOwnerByIndex(msg.sender,i);
                nod_data[nft_no].withdrawRew+=get_nodeRew(nft_no);
            }
            TOKEN(EXOR_token).transfer(msg.sender,Total_reward);

            
            

            return true;

        }

        function getAll_burns() public view returns (burn_data[] memory burns)
        { 
            uint num = user[msg.sender].total_burn;
        
         
           burn_data[] memory temp_arr =  new burn_data[](num);
            burns =  new burn_data[](num) ;

            for(uint i=0;i<num;i++)
            {
                temp_arr[i]=user[msg.sender].burn[i]; 
                uint total_earned = perBurn_Reward(i,msg.sender);
                temp_arr[i].earned_Reward = total_earned;            
                temp_arr[i].pending_Reward = ((( user[msg.sender].burn[i].amount * user[msg.sender].burn[i].apy) * 360)/100 ether )- total_earned;            

            }

            uint count=num;
            for(uint i=0;i<num;i++)
            {
                count--;
                burns[i]=temp_arr[count];

            }

            return burns;

        }

        function getDirects(address inv) view public returns(address[] memory)
        {
            return user[inv].myReferrals;
        } 

        



        function transferOwnership(address _owner) onlyOwner public
        {
            owner = _owner;
        }


       function withdrawFunds(uint _amount) onlyOwner public
        {
            uint bal = TOKEN(EXOR_token).balanceOf(address(this));
            require(bal>=_amount);
            TOKEN(EXOR_token).transfer(owner,_amount); 
        }

        function updateCode(address newCode) onlyOwner public 
        {
            updateCodeAddress(newCode);
        }
                
        function update_exorPrice(uint _val) onlyOwner public 
        {
            exorUsdPrice=_val;
        }        
        
        function update_directRewPercentage(uint _val) onlyOwner public 
        {
            directRewPercentage=_val;
        }  
        
        function update_feePrice(uint _val) onlyOwner public 
        {
            feePriceInDollar=_val;
        }  


    }