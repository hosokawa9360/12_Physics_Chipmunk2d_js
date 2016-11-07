var gameScene = cc.Scene.extend({
   onEnter: function() {
      this._super();
      gameLayer = new game();
      gameLayer.init();
      this.addChild(gameLayer);
   }
});
var game = cc.Layer.extend({
   space: null,
   ctor: function() {

      this._super();
      var backgroundLayer = cc.LayerGradient.create(cc.color(0xdf, 0x9f, 0x83, 255), cc.color(0xfa, 0xf7, 0x9f, 255));
      this.addChild(backgroundLayer);

      this.initSpace();
      var winWidth = cc.winSize.width
      var winHeight = cc.winSize.height
      this.createDynamicObject(res.totem_png, winWidth / 2 - 10, winHeight, 100, 0.2, 0.8, "")
      this.createStaticObject(res.ground_png, cc.winSize.width / 2, 100);
      //     this.createFloor();
      // this.createPhysicsSprite();

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
      // shape.setElasticity(1);
      // shape.setFriction(0.2);
      this.space.addShape(shape);
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
      this.space.addShape(shape);

      physicsSprite.setBody(body);
      physicsSprite.setPosition(posX, posY);
      this.addChild(physicsSprite);

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

      // 物理エンジンの更新
      this.space.step(dt);
   },
});
