# 12_Physics_Chipmunk2D_js

### 1.基本セッティング

### 2.物理剛体の定義をする関数をつくる

Dynamic型の剛体を作る
 ```
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
 ```
 静的剛体を作る
 ```

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
 ```

	 gameLayerを編集  
 ```
 var winWidth = cc.winSize.width
 var winHeight = cc.winSize.height
 this.createDynamicObject(res.totem_png, winWidth / 2 - 10, winHeight, 100, 0.2, 0.8, "")
 this.createStaticObject(res.ground_png, cc.winSize.width / 2, 100);
 ```


### 2.物理剛体に力を加えてみる

createDynamicObject: function(spriteImage, posX, posY, mass, friction, elasticity, type) {
の最後に　作成した　スプライト返すように記述する

```
  return physicsSprite;
```
外部変数を定義
```
var totem;
```
createDynamicObjectで作成したスプライトをtotemにぶち込む
```
totem =  this.createDynamicObject(res.totem_png, winWidth / 2 - 10, winHeight, 1, 0.2, 0.8, "")
```
タッチイベントを取得できるように
```
  cc.eventManager.addListener(touchListener,this)
	```
リスナーを作成して、物理剛体に力を加える
```
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
```
### 3.他の物体にぶつけてみる

外部変数  
```
var blocks = [];
```
var gameの中
```
blocks[0] = this.createDynamicObject(res.brick1x1_png, winWidth* 0.7,120,1, 10, 0.8, "")
blocks[1] = this.createDynamicObject(res.brick1x1_png, winWidth* 0.7,120+25*1,1, 10, 0.8, "")
blocks[2] = this.createDynamicObject(res.brick1x1_png, winWidth* 0.7,120+25*2,1, 10, 0.8, "")
blocks[3] = this.createDynamicObject(res.brick1x1_png, winWidth* 0.7,120+25*3,1, 10, 0.8, "")
```


衝突したら、スプライトが飛んでいくはずのなのに・・・・

### 4.PhysicsSpriteを使わないで実装しなおす

```
createDynamicObject: function(spriteImage, posX, posY, mass, friction, elasticity, type) {

   var sprite = new cc.Sprite.create(spriteImage);
   var width = sprite.getContentSize().width;
   var height = sprite.getContentSize().height;

   var body = new cp.Body(mass, cp.momentForBox(mass, width, height));
   body.setPos(cp.v(posX, posY));
   space.addBody(body);
   sprite.setPosition(posX, posY);
   this.addChild(sprite, 5);

   // 形状、摩擦係数、反発係数を設定
   var shape = new cp.BoxShape(body, width, height);
   shape.setFriction(friction);
   shape.setElasticity(elasticity);
   shape.setCollisionType(type);
   space.addShape(shape);
   shape.image = sprite;
   shape.body = body;
     shape.type = type;
   sprite.shape = shape;
   shapeArray.push(shape);

   return sprite;
},
```
PhysicsSpriteを使わないので、グローバル変数にすべてのShapeを管理する  
`　var shape = []; `
を定義して物理オブジェクトを管理する  
また、update関数で、すべての物理オブジェクトの座標情報を用いて、物理オブジェクトに紐づけされているスプライトの座標情報を更新しした  
```
update: function(dt) {
   // 物理エンジンの更新
   space.step(dt);
   for (var i = 0; i < shapeArray.length; i++) {
      var shape = shapeArray[i];
      shape.image.x = shape.body.p.x;
      shape.image.y = shape.body.p.y;
      var angle = Math.atan2(-shape.body.rot.y, shape.body.rot.x);
      shape.image.rotation = angle * 180 / 3.14;
   }
},
```

### 5.タッチリスナーを強化した
実装したこと
トーテムをタップしたら、トーテムに衝撃を加える
ボックスをタップしたら、消去する
何もないところをタップしたら、ボックスを生成する

```
var touchListener = cc.EventListener.create({
   event: cc.EventListener.TOUCH_ONE_BY_ONE, // シングルタッチのみ対応
   swallowTouches: false, // 以降のノードにタッチイベントを渡す
   onTouchBegan: function(touch, event) { // タッチ開始時
      var pos = touch.getLocation();

console.log("shapeArray.length:",shapeArray.length)
      // すべてのshapをチェックする
			for (var i = 0; i < shapeArray.length; i++) {
         var shape = shapeArray[i];
				 		console.log("shape.type:",i,shape.type)
						//pointQueryは物理オブジェクトの内側がタップされたかどうか判定する関数
         if (shape.pointQuery(cp.v(pos.x, pos.y)) != undefined) {
					 		console.log("hit ")
            if (shape.type == SpriteTag.block) {
								//ブロックをタップしたときは、消去する
               space.removeBody(shape.getBody());
               space.removeShape(shape);
               gameLayer.removeChild(shape.image);
               shapeArray.splice(i, 1);
							 	console.log("remove block")
               return;
						 } else if(shape.type == SpriteTag.totem) {
							 	// トーテムをタップしたときは、衝撃を与える
								shape.body.applyImpulse(cp.v(500, 0), cp.v(0, -20))
								return;
						 }
				}
			}
			// 何も無い場所をタップしたときは箱を追加する
				gameLayer.createDynamicObject(res.brick1x1_png, pos.x, pos.y, 1, 10, 0.8, SpriteTag.block)
				return;

   }

});
```
