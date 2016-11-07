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
