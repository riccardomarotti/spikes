/// <reference path="babylon.2.5.d.ts" />

var createScene = function () {
    var keys = [];
    var canvas3D = document.getElementById('canvas3D');
    var engine3D = new BABYLON.Engine(canvas3D, true);
    var scene3D = new BABYLON.Scene(engine3D);

    var camera3D = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0.5, 1.5, 10, new BABYLON.Vector3(0, 0, 0), scene3D);
    camera3D.attachControl(canvas3D, true, true , true);

    var light3D = new BABYLON.HemisphericLight("light3D", new BABYLON.Vector3(1, 0, 0), scene3D);
    light3D.intensity = 0.7;

    var cylinder3D = BABYLON.Mesh.CreateCylinder("cylinder", 6, 2, 2, 50, 1, scene3D, false);
    var plane3D = BABYLON.MeshBuilder.CreateBox("box", {size: 5, width: 0.1}, scene3D);
    plane3D.backFaceCulling = false;

    var planeMaterial = new BABYLON.StandardMaterial("transparent", scene3D);
    planeMaterial.backFaceCulling = true;
    planeMaterial.alpha = 0.5;
    var planeColor = new BABYLON.Color3(0.5, 1, 1);

    planeMaterial.diffuseColor = planeColor;
    plane3D.material = planeMaterial;
    
    var canvas2D = document.getElementById('canvas2D');
    var engine2D = new BABYLON.Engine(canvas2D, true);
    var scene2D = new BABYLON.Scene(engine2D);
    var light2D = new BABYLON.HemisphericLight("light2D", new BABYLON.Vector3(1, 1, 1), scene2D);
    light2D.intensity = 1;

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

    var plane2D = null;
    var cylinder2D = null;
    var blackMaterial = new BABYLON.StandardMaterial("mat", scene2D);
    blackMaterial.specularColor = new BABYLON.Vector3(0,0,0);
    scene3D.registerAfterRender(function () {
        if(plane2D) {
            plane2D.dispose();
        }
        if(cylinder2D) {
            cylinder2D.dispose();
        }

        if(keys[65]) {
            plane3D.position.x -= 0.02;
            camera2D.target.x -= 0.02;
        }

        if(keys[68]) {
            plane3D.position.x += 0.02;
            camera2D.target.x += 0.02;
        }

        var plane2Dtemp = BABYLON.CSG.FromMesh(plane3D);
        var cylinder2Dtemp = BABYLON.CSG.FromMesh(cylinder3D);
        var intersection =  plane2Dtemp.intersect(cylinder2Dtemp);
        
        cylinder2D = intersection.toMesh("intersection", blackMaterial, scene2D);
        var planeMaterial2D = new BABYLON.StandardMaterial("transparent", scene2D);
        planeMaterial2D.alpha = 0.1;
        plane2D = plane2Dtemp.toMesh("plane", planeMaterial2D, scene2D);
        
        scene2D.render();
    });

    window.addEventListener('resize', function () {
        engine3D.resize();
    });

    window.addEventListener("keydown", function(evt) {
        keys[evt.keyCode] = true
    });
    window.addEventListener("keyup", function(evt) {
        keys[evt.keyCode] = false
    });
};
