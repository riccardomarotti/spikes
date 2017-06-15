/// <reference path="babylon.2.5.d.ts" />

var KEY_A = 65;
var KEY_D = 68;
var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;

var createScene = function () {
    var movementForKeycode3D = [];
    var movementForKeycode2D = [];
    var canvas3D = document.getElementById('canvas3D');
    var engine3D = new BABYLON.Engine(canvas3D, true);
    var scene3D = new BABYLON.Scene(engine3D);

    var camera3D = new BABYLON.ArcRotateCamera("ArcRotateCamera",
                                                -0.7,
                                                0.8,
                                                10,
                                                new BABYLON.Vector3(0, 0, 0),
                                                scene3D);
    camera3D.attachControl(canvas3D, true, true , true);
    camera3D.inputs.remove(camera3D.inputs.attached.keyboard);

    var light3D = new BABYLON.HemisphericLight("light3D", new BABYLON.Vector3(1, 0, 0), scene3D);
    light3D.intensity = 0.7;

    var cylinder3D = BABYLON.Mesh.CreateCylinder("cylinder", 6, 2, 2, 50, 1, scene3D, false);
    var plane3D = BABYLON.MeshBuilder.CreateBox("box", {size: 5, width: 0.01}, scene3D);


    var planeMaterial = new BABYLON.StandardMaterial("transparent", scene3D);
    planeMaterial.alpha = 0.5;
    var planeColor = new BABYLON.Color3(0.5, 1, 1);

    planeMaterial.diffuseColor = planeColor;
    plane3D.material = planeMaterial;

    var canvas2D = document.getElementById('canvas2D');
    var engine2D = new BABYLON.Engine(canvas2D, true);
    var scene2D = new BABYLON.Scene(engine2D);

    var light2D = new BABYLON.HemisphericLight("light2D", new BABYLON.Vector3(1, 1, 1), scene2D);
    light2D.intensity = 1;

    var player2D = new BABYLON.Mesh.CreateCylinder("player", 0.1, 0.5, 0.5, 50, 1, scene2D);
    var playerMaterial = new BABYLON.StandardMaterial("playerMaterial", scene2D);
    var playerColor = new BABYLON.Color3(1, 0.3, 0.4);
    playerMaterial.diffuseColor = playerColor;
    player2D.material = playerMaterial;
    player2D.rotation.z = Math.PI/2;
    player2D.position.z = -2;

    var player3D = new BABYLON.Mesh.CreateCylinder("player", 0.1, 0.5, 0.5, 50, 1, scene3D);
    var playerMaterial = new BABYLON.StandardMaterial("playerMaterial", scene3D);
    var playerColor = new BABYLON.Color3(1, 0.3, 0.4);
    playerMaterial.diffuseColor = playerColor;
    player3D.material = playerMaterial;
    player3D.rotation.z = Math.PI/2;
    player3D.position.z = -2;

    var camera2D = new BABYLON.ArcRotateCamera("ArcRotateCamera",
                                                0,
                                                1.5,
                                                10,
                                                new BABYLON.Vector3(0, 0, 0),
                                                scene2D
                                               );

    engine3D.runRenderLoop(function () {
        scene3D.render();
    });

    var target2D = BABYLON.Mesh.CreateTorus("target", 1, 0.1, 50, scene2D);
    var targetMaterial = new BABYLON.StandardMaterial("targetMaterial", scene2D);
    var targetColor = new BABYLON.Color3(0.2, 0.8, 0.5);
    targetMaterial.diffuseColor = targetColor;
    target2D.material = targetMaterial;
    target2D.rotation.z = Math.PI/2;
    target2D.position.z = 1.75;

    var target3D = BABYLON.Mesh.CreateTorus("target", 1, 0.1, 50, scene3D);
    var targetMaterial = new BABYLON.StandardMaterial("targetMaterial", scene3D);
    var targetColor = new BABYLON.Color3(0.2, 0.8, 0.5);
    targetMaterial.diffuseColor = targetColor;
    target3D.material = targetMaterial;
    target3D.rotation.z = Math.PI/2;
    target3D.position.z = 1.75;

    var cylynder2DMaterial = new BABYLON.StandardMaterial("mat", scene2D);
    cylynder2DMaterial.specularColor = new BABYLON.Vector3(0,0,0);

    scene3D.registerAfterRender(function () {
        plane3D.position.x -= movementForKeycode3D[KEY_A] || 0;
        player2D.position.x -= movementForKeycode3D[KEY_A] || 0;
        target2D.position.x -= movementForKeycode3D[KEY_A] || 0;
        camera2D.target.x -= movementForKeycode3D[KEY_A] || 0;

        plane3D.position.x += movementForKeycode3D[KEY_D] || 0;
        player2D.position.x += movementForKeycode3D[KEY_D] || 0;
        target2D.position.x += movementForKeycode3D[KEY_D] || 0;
        camera2D.target.x += movementForKeycode3D[KEY_D] || 0;

        var plane2Dtemp = BABYLON.CSG.FromMesh(plane3D);
        var cylinder2Dtemp = BABYLON.CSG.FromMesh(cylinder3D);
        var intersection =  plane2Dtemp.intersect(cylinder2Dtemp);

        var cylinder2D = null;
        if(cylinder3D.intersectsMesh(plane3D)){
            cylinder2D = intersection.toMesh("intersection", cylynder2DMaterial, scene2D);
        }

        var planeMaterial2D = new BABYLON.StandardMaterial("plane2DMaterial", scene2D);
        planeMaterial2D.diffuseColor = new BABYLON.Color3(0.5, 1, 1);
        var plane2D = plane2Dtemp.toMesh("plane", planeMaterial2D, scene2D);
        plane2D.position.x -= 0.01;

        player2D.position.z -= movementForKeycode2D[KEY_LEFT] || 0;
        player2D.position.y -= movementForKeycode2D[KEY_DOWN] || 0, 0;
        player2D.position.z += movementForKeycode2D[KEY_RIGHT] || 0;
        player2D.position.y += movementForKeycode2D[KEY_UP] || 0;

        if(cylinder2D && cylinder2D.intersectsMesh(player2D, false)) {
            player2D.position.z = -2;
            player2D.position.y = 0;
        }

        if(player2D.intersectsPoint(target2D.position)) {
            engine3D.stopRenderLoop();
        }

        player3D.position = player2D.position;
        target3D.position = target2D.position;

        scene2D.render();

        plane2D.dispose();
        if (cylinder2D) {
            cylinder2D.dispose();
        }
    });

    window.addEventListener('resize', function () {
        engine3D.resize();
        engine2D.resize();
    });

    window.addEventListener("keydown", function(evt) {
        movementForKeycode3D[evt.keyCode] = 0.02;
        movementForKeycode2D[evt.keyCode] = 0.1;
    });
    window.addEventListener("keyup", function(evt) {
        movementForKeycode3D[evt.keyCode] = 0;
        movementForKeycode2D[evt.keyCode] = 0;
    });
};
