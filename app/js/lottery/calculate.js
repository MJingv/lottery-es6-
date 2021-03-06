
class Calculate{
	//计算注数
	//play_name 当前玩法标识名称（eg:r3...）
	//active 当前选中的号码的个数
	computeCount(active,play_name){
		let count=0;
		//判断是否为合法玩法(r2~r8)
		const exist=this.play_list.has(play_name);
		//生成长度为active选中的个数，填充值为0的数组
		const arr=new Array(active).fill(0);
		if (exist && play_name.at(0)==='r') {//选择正确
			count=Calculate.combine(arr,play_name.split('')[1]).length;

		}
		return count;
	}
	//奖金范围预测
	//active 当前选中的号码
	//play_name 当前玩法标识（eg:r3...）
	//return 奖金范围
	//开奖号码是5个
	computeBonus(active,play_name){
		const play=play_name.split('');
		const self=this;
		let arr=new Array(play[1]*1).fill(0);
		let min,max;
		if (play[0]==='r') {//如果是任选玩法
			let min_active=5-(11-active);//最小命中数
			if (min_active>0) {
				if (min_active-play[1]>=0) {
					arr=new Array(min_active).fill(0);
					min=Calculate.combine(arr,play[1]).length
				}else {
					// 玩法是r5以上
					if (play[1]-5>0&&active-play[1]>=0) {
						arr=new Array(active-5).fill(0);
						min=Calculate.combine(arr,play[1]-5).length
					}else {
						min=active-play[1]>-1?1:0
					}
				}
			}else {
				min=active-play[1]>-1?1:0;
			}

			let max_active=Math.min(active,5);
			if (play[1]-5>0) {
				
				if (active-play[1]>=0) {
					arr=new Array(active-5).fill(0);
					max=Calculate.combine(arr,play[1]-5).length
				}else {
					max=0;

				}
			}else  if(play[1]-5<0){
				arr=new Array(Math.min(active,5)).fill(0);
				max=Calculate.combine(arr,play[1]).length;
			}else {
				max=1;
			}


		}
		return [min,max].map(item=>
			item*self.play_list.get(play_name).bonus)

	}

	//组合运算
	//arr 参与组合运算的数组
	//size 组合运算的基数 (eg:r2,r3中的2,3)
	static combine(arr,size){//静态方法
		//保存结果
		let allResult=[];
		
		(function f(arr,size,result){
			let arrLen=arr.length;
			if (size>arrLen) {
				return;
			}
			if (size===arrLen) {
				allResult.push([].concat(result,arr))
			}else {
				for(let i=0;i<arrLen;i++){
					let newResult=[].concat(result);
					newResult.push(arr[i]);
					if (size===1) {
						allResult.push(newResult)
					}else {
						let newArr=[].concat(arr);
						newArr.splice(0,i+1);
						f(newArr,size-1,newResult);
					}
				}
			}
		})(arr,size,[])
		return allResult

	}
}
export default Calculate