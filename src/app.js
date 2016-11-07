//衝突タイプ（衝突時の判別用）
if(typeof SpriteTag == "undefined") {
	var SpriteTag = {};
	SpriteTag.totem = 0; // トーテム
	SpriteTag.block = 1; // ブロック
	SpriteTag.object = 2; //オブジェ
};


var gameScene = cc.Scene.extend({
   onEnter: function() {
      this._super();
      gameLayer = new game();
      gameLayer.init();
      this.addChild(gameLayer);
   }
});

var totem;

var blocks = [];

var game = cc.Layer.extend({
   space: null,
   ctor: function() {

      this._super();
      var backgroundLayer = cc.LayerGradient.create(cc.color(0xdf, 0x9f, 0x83, 255), cc.color(0xfa, 0xf7, 0x9f, 255));
      this.addChild(backgroundLayer);

      this.initSpace();
      var winWidth = cc.winSize.width
      var winHeight = cc.winSize.height
      totem =  this.createDynamicObject(res.totem_png, winWidth*0.4 , winHeight, 1, 0.2, 0.8, "")
     this.createStaticObject(res.ground_png, cc.winSize.width / 2, 100);

blocks[0] = this.createDynamicObject(res.brick1x1_png, winWidth* 0.7,120,1, 10, 0.8, "")
blocks[1] = this.createDynamicObject(res.brick1x1_png, winWidth* 0.7,120+25*1,1, 10, 0.8, "")
blocks[2] = this.createDynamicObject(res.brick1x1_png, winWidth* 0.7,120+25*2,1, 10, 0.8, "")
blocks[3] = this.createDynamicObject(res.brick1x1_png, winWidth* 0.7,120+25*3,1, 10, 0.8, "")

      cc.eventManager.addListener(touchListener,this)

   },




   createStaticObject: function(spriteImage, posX, posY) {
      var staticSprite = cc.Sprite.create(spriteImage);

      staticSprite.setPosition(posX, posY);
      this.addChild(staticSprite);
      var staticBody = new cp.StaticBody(); // 静的ボディを作成
      staticBody.p = cp.v(posX, posY)
      var width = staticSprite.getContentSize().width
      var height = staticSprite.getContentSize().height
      var shape = new cp.BoxShape(staticBody, width, height);
      shape.setCollisionType(SpriteTag.block);
      // shape.setElasticity(1);
      // shape.setFriction(0.2);
      this.space.addShape(shape);

      return shape;
   },

   createDynamicObject: function(spriteImage, posX, posY, mass, friction, elasticity, type) {

      // 物理スプライト
      var physicsSprite = new cc.PhysicsSprite(spriteImage);

      // 質量
      // var mass = 100;

      // スプライトの大きさを取得
      var width = physicsSprite.getContentSize().width;
      var height = physicsSprite.getContentSize().height;

      var body = new cp.Body(mass, cp.momentForBox(mass, width, height));

      this.space.addBody(body);

      // 形状、摩擦係数、反発係数を設定
      var shape = new cp.BoxShape(body, width, height);
      shape.setFriction(friction);
      shape.setElasticity(elasticity);
//トーテムであるフラグ
      shape.setCollisionType(SpriteTag.totem);

      this.space.addShape(shape);

      physicsSprite.setBody(body);
      physicsSprite.setPosition(posX, posY);
      this.addChild(physicsSprite);

      return physicsSprite;
   },

   initSpace: function() {
      //chipmunk2Dの物理空間 space
      this.space = new cp.Space();
      // 重力加速度
      this.space.gravity = cp.v(0, -980);
      // shapeを可視化する（デバッグ用）
      this.addChild(new cc.PhysicsDebugNode(this.space));
      this.scheduleUpdate();
   },


   createFloor: function() {
      // 床を静的剛体として作る

      var floorThickness = 10;
      var startPos = cp.v(0, 100);
      var endPos = cp.v(cc.winSize.width, 100);

      var floor = new cp.SegmentShape(this.space.staticBody, startPos, endPos, floorThickness);
      floor.setFriction(0.2);
      floor.setElasticity(1);
      this.space.addShape(floor);


   },

   update: function(dt) {
     // ランナーのスプライトとBodyの同期
      // 物理エンジンの更新
      this.space.step(dt);
       for(i=0; i<blocks.length ;i++){
         console.log( blocks[i].x)
       }
      //     var body =  blocks[i].getBody()
      // // //      blocks[i].setPosition(body.p);
      //       blocks[i].setPosition(-cc.radiansToDegrees(body.w));
      //  }
    },
});

var touchListener = cc.EventListener.create (
  {
    event: cc.EventListener.TOUCH_ONE_BY_ONE, // シングルタッチのみ対応
    swallowTouches:false, // 以降のノードにタッチイベントを渡す
   onTouchBegan:function(touch, event){ // タッチ開始時
     var body = totem.getBody()
     console.log(body)
     //『body』に力を加えます
     body.applyImpulse(cp.v(500, 500),cp.v(0,0))
   }
  }
);
