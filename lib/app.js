$(function(){
            
    var Memo = Backbone.Model.extend({
        defaults: {
            collected: false,
            clicked: false
        },
        initialize: function() {
            if (!this.get("collected")) {
                this.set({
                    "collected": this.defaults.collected
                });
            }
            if (!this.get("clicked")) {
                this.set({
                    "clicked": this.defaults.clicked
                });
            }
        },
        toggleClicked: function(){
            this.get('clicked') ? this.set({
                'clicked':false
            }) : this.set({
                'clicked':true
            });
        },
        clear: function() {
            this.destroy();
            this.view.remove();
        }
    });
                
    var MemoView = Backbone.View.extend({
	template: _.template($('#memo-template').html()),
        events: {
            "click .memo": "memoClicked"
        },
        initialize: function() {
            _.bindAll(this, "render", 'memoClicked');
            this.model.bind('change', this.render);
            this.model.view = this;
        },
        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },
        memoClicked: function(){
            if(this.model.get('clicked') || memos.clicked().length === 2 || this.model.get('collected')) {
                return;
            }
            this.model.toggleClicked();
            // check if memo cards match
            if(memos.clicked().length === 2){
                
                if(memos.clickedAreTheSame()){
                    window.setTimeout(function(){
                        while(memos.clicked().length !== 0){
                            memos.clicked()[0].set({
                                collected: true,
                                clicked: false
                            });
                        }
                    }, 1200);
                }
                else {
                    window.setTimeout(function(){
                        while(memos.clicked().length !== 0){
                            memos.clicked()[0].set({
                                clicked: false
                            });
                        }
                    }, 1200);
                }
            }
        }
    });
            
    // COLLECTION OF MEMOS
    var Memos = Backbone.Collection.extend({
	model: Memo,
        localStorage: new Store("memos"),
        collected: function(){
            return this.filter(function(memo){
                return memo.get('collected');
            });
        },
        clicked: function(){
            return this.filter(function(memo){
                return memo.get('clicked');
            });
        },
        clickedAreTheSame: function(){
            return this.clicked()[0].get('key') === this.clicked()[1].get('key');
        }
    });
                
    // APPVIEW
    var AppView = Backbone.View.extend({
        el: $("#app"),
	CARDSUPSIDE: "./images/card.png",
	CONTENTS: [],
	PAIRS: [
		{"cards/card-1-a.png": "cards/card-1-b.png"}, // A
		{"cards/card-2-a.png": "cards/card-2-b.png"}, // B
		{"cards/card-3-a.png": "cards/card-3-b.png"}, // C
		{"cards/card-4-a.png": "cards/card-4-b.png"}, // A
		{"cards/card-5-a.png": "cards/card-5-b.png"}, // E
		{"cards/card-6-a.png": "cards/card-6-b.png"}, // F
		{"cards/card-7-a.png": "cards/card-7-b.png"}, // G
		{"cards/card-8-a.png": "cards/card-8-b.png"}, // H
		{"cards/card-9-a.png": "cards/card-9-b.png"}, // I
		{"cards/card-a-a.png": "cards/card-a-b.png"}, // J
		{"cards/card-b-a.png": "cards/card-b-b.png"}, // K
		{"cards/card-c-a.png": "cards/card-c-b.png"}, // L
                {"cards/card-d-a.png": "cards/card-d-b.png"}, // M
                {"cards/card-e-a.png": "cards/card-e-b.png"}, // N
                {"cards/card-f-a.png": "cards/card-f-b.png"}, // O
                {"cards/card-g-a.png": "cards/card-g-b.png"}, // P
                {"cards/card-h-a.png": "cards/card-h-b.png"}, // R
                {"cards/card-i-a.png": "cards/card-i-b.png"}, // S
                {"cards/card-j-a.png": "cards/card-j-b.png"}, // T
                {"cards/card-k-a.png": "cards/card-k-b.png"}, // U
                {"cards/card-l-a.png": "cards/card-l-b.png"}, // W
                {"cards/card-m-a.png": "cards/card-m-b.png"}, // Y
                {"cards/card-n-a.png": "cards/card-n-b.png"}  // Z
        ],
        initialize: function(){
            _.bindAll(this, 'render', 'createMemos', 'createContent', 'addMemo');
            memos.bind('add', this.addMemo);
            memos.bind('all', this.render);
            this.createContent();
            this.createMemos();
        },
        createMemos: function(){
            var arr = this.shuffle(this.CONTENTS);
            console.log(this.CONTENTS); 
            var k=0;
            for(var j=0; j<4; j++){
                for(var i=0; i<6; i++){
                    memos.create({
                        coords:{
                            x: 130*i,
                            y: 130*j
                        },
                        content: arr[k].content,
                        key: arr[k].key,
                        cardupside: this.CARDSUPSIDE
                    });
                    k++;
                }
            }
        },
        addMemo: function(memo){
            var view = new MemoView({
                model: memo
            });
            this.$("#memos").append(view.render().el);
        },
        createContent: function(){
            this.PAIRS = this.shuffle(this.PAIRS);
            for(var i=0; i<12; i++){
                for(var key in this.PAIRS[i]){
                    this.CONTENTS.push({key: i,content: key, isA: true});
                    this.CONTENTS.push({key: i,content: this.PAIRS[i][key], isA: false});
                }
            }
        },
	shuffle: function(o){ 
	        for(var j, x, i = o.length;i;j = parseInt(Math.random() * i,10), x = o[--i], o[i] = o[j], o[j] = x);
	        return o;
    	},
        render: function(){
        }
    });
            
    var memos = new Memos();
    var appView = new AppView();
                
});
