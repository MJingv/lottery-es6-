import $ from 'jquery';

class Base{
		// 初始化奖金及说明
		initPlayList(){
			this.play_list. //map数据结构
		set('r2',{
			bonus:6,
			tip:'从01～11中任选2个或多个号码，所选号码与开奖号码相同，即中奖<em class="red">6</em>元',
			name:'任二'
		})
		.set('r3',{
			bonus:19,
			tip:'从01～11中任选3个或多个号码，所选号码与开奖号码相同，即中奖<em class="red">19</em>元',
			name:'任三'
		})
		.set('r4',{
			bonus:78,
			tip:'从01～11中任选4个或多个号码，所选号码与开奖号码相同，即中奖<em class="red">78</em>元',
			name:'任四'
		})
		.set('r5',{
			bonus:540,
			tip:'从01～11中任选5个或多个号码，所选号码与开奖号码相同，即中奖<em class="red">540</em>元',
			name:'任五'
		})
		.set('r6',{
			bonus:90,
			tip:'从01～11中任选6个或多个号码，所选号码与开奖号码相同，即中奖<em class="red">90</em>元',
			name:'任六'
		})
		.set('r7',{
			bonus:26,
			tip:'从01～11中任选7个或多个号码，所选号码与开奖号码相同，即中奖<em class="red">26</em>元',
			name:'任七'
		})
		.set('r8',{
			bonus:9,
			tip:'从01～11中任选8个或多个号码，所选号码与开奖号码相同，即中奖<em class="red">9</em>元',
			name:'任八'
		})
		
		}

		//初始化选号码
		initNumber(){
			//number是Set数据结构,!不可重复!
			for(let i=1;i<12;i++){
				//位数为2，不够在前面添加0
				this.number.add((''+i).padStart(2,'0'));
			}
		}
		//设置遗漏数据
		setOmit(omit){
			//omit是Map数据结构
			let self=this;//保存当前对象的引用
			self.omit.clear();//清除以前遗漏数据
			for(let [index,item] of omit.entries()){//遍历结果
				self.omit.set(index,item);
			}
			$(self.omit_el).each(function(index,item){
				$(item).text(self.omit.get(index))
			})
		}
		//设置开奖
		setOpenCode(code){
			//open_code是Set数据结构,！开奖号码不可重复！
			let self=this;//保存当前对象的引用
			self.open_code.clear();//清除以前获奖选号
			for(let item of code.values()){
				self.open_code.add(item);
			}
			//更新获奖号码接口
			self.updateOpenCode&&self.updateOpenCode.call(self,code);
		}
		//号码选中和取消
		toggleCodeActive(e){
			let self=this;//保存当前对象的引用
			let $cur=$(e.currentTarget);//获取子元素
			$cur.toggleClass('btn-boll-active');
			self.getCount();//更新金额
		}

		//切换玩法
		changePlayNav(e){
			let self=this;
			let $cur=$(e.currentTarget);//获取子元素
			$cur.addClass('active').siblings().removeClass('active');
			self.cur_play=$cur.attr('desc').toLowerCase();//获取当前玩法
			$('#zx_sm span').html(self.play_list.get(self.cur_play).tip);
			$('.boll-list .btn-boll').removeClass('btn-boll-active');
			$('#play_tips_num').html(self.play_list.get(self.cur_play).tip.charAt(9));
			self.getCount();

		}
		//操作区功能
		assistHandle(e){
			e.preventDefault();
			let self=this;
			let $cur=$(e.currentTarget);
			let index=$cur.index();
			$('.boll-list .btn-boll').removeClass('btn-boll-active');
			//全选
			if (index===0) {
				$('.boll-list .btn-boll').addClass('btn-boll-active');
		 	//选大
			}
			if (index===1) {
				$('.boll-list .btn-boll').each(function(i,t){
					if (t.textContent-5>0) {
						$(t).addClass('btn-boll-active')
					}
				})

			}
			//选小
			if (index===2) {
				$('.boll-list .btn-boll').each(function(i,t){
					if (t.textContent-6<0) {
						$(t).addClass('btn-boll-active')
					}
				})

			}
			//奇数
			if (index===3) {
				$('.boll-list .btn-boll').each(function(i,t){
					if (t.textContent%2==1) {
						$(t).addClass('btn-boll-active')
					}
				})

			}
			//偶数
			if (index===4) {
				$('.boll-list .btn-boll').each(function(i,t){
					if (t.textContent%2==0) {
						$(t).addClass('btn-boll-active')
					}
				})

			}
			self.getCount();

		}

		//获取当前彩票名称
		getName(){
			return this.name;

		}

		//添加号码
		addCode(){
			let self=this;
			let $active=$('.boll-list .btn-boll-active ').text().match(/\d{2}/g);//2个数字一组
			let active=$active?$active.length:0;
			let count=self.computeCount(active,self.cur_play);
			if (count) {//添加条目
				self.addCodeItem($active.join(' '),self.cur_play,self.play_list.get(self.cur_play).name,count);

			}
		}

		//添加单次号码
		addCodeItem(code,type,typeName,count){
			let self=this;
			const tpl=`
			<li codes="${type}|${code}" bonus="${count*2}" count="${count}">
			 <div class='code'>
			  <b>${typeName}${count>1?'复式':'单式'}</b>
			  <b class='em'>${code}</b>
			  [${count}注,<em class="code-list-money">${count*2}</em>元]
			 </div>
			</li>
			`;
			$(self.cart_el).append(tpl);
			self.getTotal(); 

		}

		getCount(){
			let self=this;
			let active=$('.boll-list .btn-boll-active').length;
			let count=self.computeCount(active,self.cur_play);
			let range=self.computeBonus(active,self.cur_play);
			let money=count*2;
			let win1=range[0]-money;
			let win2=range[1]-money;
			let tpl;
			let c1=(win1<0&&win2<0)?Math.abs(win1):win1;
			let c2=(win2<0&&win2<0)?Math.abs(win2):win2;
			if(count===0){
				tpl-`您选了<b class="red">${count}</b>注，
				共<b class="red">${count*2}</b>元`
			}
			else if (range[0]===range[1]) {
				tpl=`您选了<b>${count}</b>注，
				共<b >${count*2}</b>元 <em>若中奖，
				奖金：<strong class="red"> ${range[0]} </strong>元，您将
				${win1>=0?'盈利':'亏损'}
				<strong class="${win1>=0?'red':'green'}">${Math.abs(win1)}</strong>元

				</em>`

			}else {
				tpl=`您选了<b>${count}</b>注，共<b>${count*2}</b>元 <em>若中奖，奖金：
				<strong class="red"> ${range[0]} </strong> 至 <strong class="red"> ${range[1]} </strong> 元,
				 您将 ${(win1<0&&win2<0)?'亏损':'盈利'}
				<strong class="${win1>=0?'red':'green'}">${c1}</strong>至
				<strong class="${win2>=0?'red':'green'}">${c2}</strong>元
				</em>`
				
			}
		$('.sel_info').html(tpl);

		}

		//计算所有金额
		getTotal(){
			let count=0;
			//遍历购物车的注数
			$('.codelist li').each(function  (index,item) {
				count+=$(item).attr('count')*1;
			})
			$('#count').text(count);
			$('#money').text(count*2);
		}

		//生成随机数
		getRandom(num){
			let arr=[],index;
			//number是Set，转换成数组
			let number=Array.from(this.number);
			while(num--){
				index=Number.parseInt(Math.random()*number.length);
				arr.push(number[index]);
				//删除已生成的数字，避免重复
				number.splice(index,1);
			}
			return arr.join(' ');
		}

		//添加随机号码
		getRandomCode(e){
				e.preventDefault();
				let num=e.currentTarget.getAttribute('count');
				let play=this.cur_play.match(/\d+/g)[0];
				let self=this;
				if(num==='0'){ 
					//清空购物车
					$(self.cart_el).html('');
					//总价清零
					$('#count').text(0);
					$('#money').text(0);


				}else {
					for(let i=0;i<num;i++){
						self.addCodeItem(self.getRandom(play),self.cur_play,self.play_list.get(self.cur_play).name,1);

					}
				}
			}

}

export default Base