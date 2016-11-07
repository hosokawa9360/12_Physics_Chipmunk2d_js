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
      this.createFloor();
      //  this.createPhysicsSprite();

      this.addBody(res.totem_png, cc.winSize.width / 2 - 10, cc.winSize.height / 2, true, 100, 0.2, 0.8, "")

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
   createPhysicsSprite: function() {

      // 物理スプライト
      var physicsSprite = new cc.PhysicsSprite(res.totem_png);

      // 質量
      var mass = 100;

      // スプライトの大きさを取得
      var width = physicsSprite.getContentSize().width;
      var height = physicsSprite.getContentSize().height;

      // 質量、慣性モーメントを設定
      mass = 100
      var body = new cp.Body(mass, cp.momentForBox(mass, width, height));
      this.space.addBody(body);

      // 形状、摩擦係数、反発係数を設定
      var shape = new cp.BoxShape(body, width, height);
      shape.setFriction(0.2);
      shape.setElasticity(0.8);
      this.space.addShape(shape);

      physicsSprite.setBody(body);
      physicsSprite.setPosition(cc.winSize.width / 2, cc.winSize.height/2);
      this.addChild(physicsSprite);
   },

   addBody: function(spriteImage, posX, posY, isDynamic, mass, friction, elasticity, type) {
      // 物理スプライト
      var physicsSprite = new cc.PhysicsSprite(spriteImage);

      // 質量
      // var mass = 100;

      // スプライトの大きさを取得
      var width = physicsSprite.getContentSize().width;
      var height = physicsSprite.getContentSize().height;

      // 質量、慣性モーメントを設定
      // mass = 100
      if (isDynamic == true) {
         var body = new cp.Body(mass, cp.momentForBox(mass, width, height));
      } else {
         var body = cp.Body(Infinity, Infinity);
      }
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
//
// addBody: function(spriteImage, posX, posY, mass, friction, elasticity, isDynamic, type) {
//
//    // 物理スプライト
//    var physicsSprite = new cc.PhysicsSprite(spriteImage);
//    // 質量
//    var mass = 100;
//    // スプライトの大きさを取得
//    var width = physicsSprite.getContentSize().width;
//    var height = physicsSprite.getContentSize().height;
//
//    //if (isDynamic) {
//       var body = new cp.Body(mass, cp.momentForBox(mass, width, height));
//  //  } else { //静止物の場合Infinityで埋める
//  //     var body = new cp.Body(Infinity, Infinity);
//    //}
//    this.space.addBody(body);
//    body.setPos(cp.v(posX, posY));
//
//    // 形状、摩擦係数、反発係数を設定
//    var shape = new cp.BoxShape(body, width, height);
//    shape.setFriction(friction);
//    shape.setElasticity(elasticity);
//    this.space.addShape(shape);
//
//    physicsSprite.setBody(body);
//    physicsSprite.setPosition(posX, posY);
//    this.addChild(physicsSprite);
// },
