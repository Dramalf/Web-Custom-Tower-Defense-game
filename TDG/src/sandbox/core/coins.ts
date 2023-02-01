const noop=(...args: any[]): any => {};
class Coins{
    private account:number=220;
    onChange=noop;
    initAccount(initCoins:number=220){
        
        this.account=initCoins;
        this.onChange(this.account)
        return this.account;
    }
    pay(coins:number){
        this.account-=coins;
        this.onChange(this.account)
        return this.account;
    }
    reward(coins:number){
        this.account+=coins;
        this.onChange(this.account)
        return this.account
    }
    check(){
        return this.account
    }
}
const coinsAccount=new Coins();
export default coinsAccount;