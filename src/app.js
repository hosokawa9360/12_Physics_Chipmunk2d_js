//衝突タイプ（衝突時の判別用）
if (typeof SpriteTag == "undefined") {
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

var shapeArray = [];

var blocks = [];

var g_groundHeight = 10;

var game = cc.Layer.extend({
   space: null,
   ctor: function() {

      this._super();
      var backgroundLayer = cc.LayerGradient.create(cc.color(0xdf, 0x9f, 0x83, 255), cc.color(0xfa, 0xf7, 0x9f, 255));
      this.addChild(backgroundLayer);

      this.initSpace();

      var winWidth = cc.winSize.width
      var winHeight = cc.winSize.height
      totem = this.createDynamicObject(res.totem_png,
				 winWidth * 0.4, winHeight, 1, 0.2, 0.8, SpriteTag.totem)

      this.createStaticObject(res.ground_png, cc.winSize.width / 2, 100);

      blocks[0] = this.createDynamicObject(res.brick1x1_png, winWidth * 0.7, 120, 1, 10, 0.8,  SpriteTag.block)
      blocks[1] = this.createDynamicObject(res.brick2x1_png, winWidth * 0.7, 120 + 25 * 1, 1, 10, 0.8,  SpriteTag.block)
      blocks[2] = this.createDynamicObject(res.brick1x1_png, winWidth * 0.7, 120 + 25 * 2, 1, 10, 0.8, SpriteTag.block)
      blocks[3] = this.createDynamicObject(res.brick1x1_png, winWidth * 0.7, 120 + 25 * 3, 1, 10, 0.8,  SpriteTag.block)

      cc.eventManager.addListener(touchListener, this)

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


  		var sprite = new cc.Sprite.create(spriteImage);
	    var width = sprite.getContentSize().width;
      var height = sprite.getContentSize().height;

      var body = new cp.Body(mass, cp.momentForBox(mass, width, height));
			body.setPos(cp.v(posX, posY));
      this.space.addBody(body);
		//	sprite.setBody(body);
			sprite.setPosition(posX, posY);
			this.addChild(sprite,5);

			// 形状、摩擦係数、反発係数を設定
      var shape = new cp.BoxShape(body, width, height);
      shape.setFriction(friction);
      shape.setElasticity(elasticity);
      shape.setCollisionType(type);
      this.space.addShape(shape);
			shape.image = sprite;
			sprite.shape = shape;
			shapeArray.push(shape);

			return sprite;
   },

   initSpace: function() {
      //chipmunk2Dの物理空間 space
      this.space = new cp.Space();
      // 重力加速度
      this.space.gravity = cp.v(0, -980);
      // shapeを可視化する（デバッグ用）
      this.addChild(new cc.PhysicsDebugNode(this.space, 999));
      //物理エンジンで計算する地面領域を作る（これがないと計算されない）
      var wallBottom = new cp.SegmentShape(this.space.staticBody,
         cp.v(-4294967294, g_groundHeight), // start point
         cp.v(4294967295, g_groundHeight), // MAX INT:4294967295
         0); // thickness of wall
      this.space.addStaticShape(wallBottom);
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
			 for (var i = 0; i < shapeArray.length; i++) {
	         var shape = shapeArray[i];
	         shape.image.x = shape.body.p.x;
	         shape.image.y = shape.body.p.y;
	         var angle = Math.atan2(-shape.body.rot.y, shape.body.rot.x);
	         shape.image.rotation = angle * 180 / 3.14;
	    }
   },
});

var touchListener = cc.EventListener.create({
   event: cc.EventListener.TOUCH_ONE_BY_ONE, // シングルタッチのみ対応
   swallowTouches: false, // 以降のノードにタッチイベントを渡す
   onTouchBegan: function(touch, event) { // タッチ開始時
      var body = totem.shape.body;
      console.log(body)
         //『body』に力を加えます
      body.applyImpulse(cp.v(500, 0), cp.v(0, -20))
         //body.applyForce(cp.v(500, 500),cp.v(0,0))

   }
});
