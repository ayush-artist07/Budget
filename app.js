var budgetController=(function (){
    
    //function constructor are used to create each object as there is going to lots of object
    
    var income=function(id,description,value)
    {
        this.id=id;
        this.description=description;
        this.value=value;
    };
    
    var expenses=function(id,description,value)
    {
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    };
        
    expenses.prototype.calculatePercentage=function(totalincome)
    {
        if(totalincome>0)
        this.percentage=Math.round((this.value/totalincome)*100);
        
        else
            this.percentage=-1;
    };
    
    expenses.prototype.getPercentage=function()
    {
        return this.percentage;
    };
    //Data structure to store all the data generated during the object creation
    var data={
        allItems:{
        expense:[],
        income:[]
    },
        Totals:{
            expense:[],
            income:[]
        },
        budget:0,
        percentage:-1
    };
    
    var calculateTotal=function(type)
    {
        var sum=0;
        data.allItems[type].forEach(function(cur)
        {
            sum=sum+(Number)(cur.value);
        })
        data.Totals[type]=sum;
    };
    
    return {
        addItems:function(type,des,val){
            var newItem;
            
            //This will help us to retrieve the last elemnents Id and we will add one to it to get new id.
            
            if(data.allItems[type].length>0)
                {
                    ID=data.allItems[type][data.allItems[type].length-1].id+1;
                    
                }
            else {
                ID=1; //if there is no element before hand
            }
            
            //Create new object based on the type i.e income or expesnse
            if(type==='income')
             newItem=new income(ID,des,val);
            else if(type==='expense')
             newItem=new expenses(ID,des,val);
            
            //So this will enter the value in our array at the last when the object of income or expense is created 
            data.allItems[type].push(newItem);
            return newItem;
        },
        
        
        calculateBudget:function()
        {
            //1.calculate total income and expense
            calculateTotal('expense');
            calculateTotal('income');
            
            //2.cal total budget
            data.budget=data.Totals.income-data.Totals.expense;
            
            //3.Calculate Percentage
            if(data.Totals.income>0)
            data.percentage=Math.round((data.Totals.expense/data.Totals.income)*100);
            else
                data.percentage=-1;
            
        },
        
        calculatePercentages:function(){
            
            data.allItems.expense.forEach(function(cur)
            {
                cur.calculatePercentage(data.Totals.income);
            })
            
        },
        getPercantages:function()
        {
            var all=data.allItems.expense.map(function(cur)
            {
               return cur.getPercentage();
            })
           return all;
        },
        
        deleteItem: function(type, id) {
            var ids, index;
            
            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3
            
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },
        getBudget:function()
        {
            return {
                budget:data.budget,
                totalIncome:data.Totals.income,
                totalExpense:data.Totals.expense,
                percentage:data.percentage
            
            }
        },
        testing: function() {
            console.log(data);
        }
        };
    
})();




var UIController=(function(){
    var DOMStrings={
        type:'.add__type',
        description:'.add__description',
        value:'.add__value',
        button:'.add__btn',
        inc:'.income__list',
        exp:'.expenses__list',
        totalbudget:'.budget__value',
        totalIncome:'.budget__income--value',
        totalExpense:'.budget__expenses--value',
        percentage:'.budget__expenses--percentage',
        container:'.container',
        percentageofexpense:'.item__percentage',
        monthYear:'.budget__title--month',
        type:'.add__type'
        
    };
    var nodeListforEach=function(list,callback)
            {
                for(var i=0;i< list.length;i++)
                    {
                        callback(list[i],i);
                    }
            };
    
    var formatNumbers=function(numb,type)
    {
        var num,numssplit,int,dec;
        
        numb=Math.abs(numb);
        numb=numb.toFixed(2);
        
        numssplit=numb.split('.');
        int=numssplit[0];
        
        if(int.length>3)
            {
                int = int.substr(0,int.length-3)+ "," + int.substr(int.length-3,3);
                
            }
        
        dec=numssplit[1];
        
        type==='income' ? sign='+': sign='-';
        
        return sign +" "+ int + "." + dec;
    };
    
    return {
        getinput:function(){
        return {
            type:document.querySelector(DOMStrings.type).value,
            description:document.querySelector(DOMStrings.description).value,
            value:document.querySelector(DOMStrings.value).value
        }
        },
         displayBudget:function(obj)
        {
            obj.budget>0?type='income':type='expense';

          document.querySelector(DOMStrings.totalbudget).textContent=formatNumbers(obj.budget,type);
            document.querySelector(DOMStrings.totalIncome).textContent=formatNumbers(obj.totalIncome,'income');
            document.querySelector(DOMStrings.totalExpense).textContent=formatNumbers(obj.totalExpense,'expenses');
            if(obj.percentage>0)
            document.querySelector(DOMStrings.percentage).textContent=obj.percentage+ '%';
            else
              document.querySelector(DOMStrings.percentage).textContent='___';  
            
        },
        
        displayDate:function()
        {
            var now,month,year;
            
            now=new Date();
            month=now.getMonth();
            
            var months=new Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec');
            year=now.getFullYear();
            
            document.querySelector(DOMStrings.monthYear).textContent=" "+months[month]+" "+year;
        },
        changedUI:function()
        {
            var fields=document.querySelectorAll(".add__type,.add__description ,.add__value"
            );
            
            nodeListforEach(fields,function(curr)
            {
                curr.classList.toggle('red-focus');
                            
                            });
            document.querySelector(DOMStrings.button).classList.toggle('red');
        },
        DOM:function()
            {
                return DOMStrings;
            },
        addListItem:function(obj,type)
        {
            var html,newHtml,element;
            //Create a Html place holder to place the text
            if(type==='income')
            {
                element=DOMStrings.inc;
                html='<div class="item clearfix" id="income-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            else if(type==='expense')
                {
                    element=DOMStrings.exp;
                 html='<div class="item clearfix" id="expense-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                    
                }
            
            //substitute this with the actual object data
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%des%',obj.description);
            newHtml=newHtml.replace('%val%',formatNumbers(obj.value,type));
            
            //Insert the HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        deleteListItem:function(selectorID)
        {
            var selectID=document.getElementById(selectorID);
            selectID.parentNode.removeChild(selectID);
        },
        
        displayPercentages:function(perc)
        {
            var field=document.querySelectorAll(DOMStrings.percentageofexpense);
            
            
            nodeListforEach(field,function(cur,index)
            {
                
                if(perc[index]>0)
                cur.textContent=perc[index]+ "%";
            
                
            else
                cur.textContent="---";
                
                            
                            });
        },
        clearFields:function()
        {
            var fields,fieldArr;
         
          //To select the field that we want to clear
           fields=document.querySelectorAll(DOMStrings.description + ', ' +DOMStrings.value);
         
         //To change the list to an Array
         fieldArr=Array.prototype.slice.call(fields);
         
         //Using for each loop to traverse to all the elements here 2 only
         fieldArr.forEach(function(cur,index,array){
             cur.value="";
            
        })
         
         fieldArr[0].focus();
         
    }
    

}
})();



var Controller=(function (x,y){
    
    var setEventListner=function()
    {
        var DOMCntrl=y.DOM();
    document.querySelector(DOMCntrl.button).addEventListener('click',ctrlAddItem);
    document.addEventListener('keypress',function(event)
    {
        
      if(event.keyCode===13)
          {
             ctrlAddItem();
          }

    });
        document.querySelector(DOMCntrl.container).addEventListener('click',ctrlDeleteItem);
        
        document.querySelector(DOMCntrl.type).addEventListener('change',y.changedUI);
         };
    var updateBudget=function()
    {
        //1. Calculate the Budget
        x.calculateBudget();
        //2. Return the Budget
        var budget=x.getBudget();
        //3.Display on UI
        y.displayBudget(budget);
    };
    
    var updatePercantages=function()
    {
        //1.Calc percentages
        x.calculatePercentages();
        //2.get percentage from budget controller
        var Per=x.getPercantages();
        //3.Update the UI
        y.displayPercentages(Per);
    };
    
    var ctrlAddItem=function()
    {
        var input,additems,UIshowitems;
       //1. Read Some input from the filled
        input=y.getinput();
        //2. Add item to the budget controller
        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
        additems=x.addItems(input.type,input.description,input.value);
        
        //3. Add the item to the UI
        UIshowitems=y.addListItem(additems,input.type);
        
        //4. Clear Fields
        y.clearFields();
        
        //5. Calculate the budget
        updateBudget();
        
        //6.Update the percentages of each 
        updatePercantages();
        
        }
    };
    
    var ctrlDeleteItem=function(event){
        
        var itemId,splitID,typeID,ID;
        itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;
        splitID=itemId.split('-'); //returns an array splitted
        typeID=splitID[0];
        ID=parseInt(splitID[1]);
        
        //1.Delete the item from DS
        x.deleteItem(typeID,ID);
        
        //2.Delete from UI
        y.deleteListItem(itemId);
        
        //3.Update and show the new Budget
        updateBudget();
        
        //4. Update the percantages of each of the element
        updatePercantages();
        
    };
    
    return {
        init:function(){
            y.displayBudget({
                budget:0,
                totalExpense:0,
                totalIncome:0,
                percentage:-1
            });
        setEventListner();
            y.displayDate();
    }
    };
    
})(budgetController,UIController);

Controller.init();
