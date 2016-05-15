// glfx object wraps everything necessary for the rendering interface
var glfx = { };

glfx.version = '0.4.0';

// echo function to output debug statements to console
glfx.echo = function(txt) {
    if(typeof console.log !== 'undefined') {
        console.log(txt);
    }
};

// WebGL context
glfx.gl = null;

// Screen-space, render to texture shader program
glfx.rttprog = null;

// Get devicePixelRatio
glfx.devicePixelRatio = window.devicePixelRatio || 1;

// reference count for assets needed before rendering()
glfx.assetRef = 0;
// function to call when all assets are loaded, set by user via glfx.whenAssetsLoaded, reset internally
glfx.onAssetsLoaded = function() { };   

// function to call after scene render
glfx.onSceneRender = function() { };

// function to schedule callback when all assets are loaded, set by user
glfx.whenAssetsLoaded = function(_callback) {                
    if(typeof _callback !== 'undefined') {
        if(glfx.assetRef === 0) {           
            _callback();
        } else {
            glfx.onAssetsLoaded = _callback;
        }
    }
};

// function to increment asset ref count
glfx.incAssetRef = function() {
    glfx.assetRef++;
    if(glfx.assetRef === 0) {
        glfx.onAssetsLoaded();
        glfx.onAssetsLoaded = function() { }; // reset
    }
};

// function to decrement asset ref count
glfx.decAssetRef = function() {
    glfx.assetRef--;
};

// Shaders class
glfx.shaders = { };

// buffer to store loaded shaders
glfx.shaders.buffer = new Array();

// Function to load vertex shader from external file
//   _url = path to shader source
//   _type = gl.VERTEX_SHADER / gl.FRAGMENT_SHADER
//   _callback = function to call after shader is created, shader object passed is shader is successfully compiled, null otherwise
glfx.shaders.load = function(_url, _name, _type, _callback) {
    glfx.decAssetRef();

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {				
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            var shaderSrc = xmlhttp.responseText;
            var shader = glfx.gl.createShader(_type);

            glfx.gl.shaderSource(shader, shaderSrc);
            glfx.gl.compileShader(shader);

            if (!glfx.gl.getShaderParameter(shader, glfx.gl.COMPILE_STATUS)) {
                glfx.echo("Failed to compile shader: " + _url);
                shader = null;
            }

            if(typeof _callback !== 'undefined') {
                _callback(shader);
            }

            glfx.shaders.buffer[_name] = shader;
            glfx.incAssetRef();
        }
    };

    xmlhttp.open("GET", _url, true);
    xmlhttp.send();
}; 


glfx.shaders.createProgram = function(_shaders, _onPostLink) {
    
    var shprog = glfx.gl.createProgram();    
    for(var i=0; i<_shaders.length; i++) {      
        glfx.gl.attachShader(shprog, _shaders[i]);
    }
    
    glfx.gl.linkProgram(shprog);    
    
    if (!glfx.gl.getProgramParameter(shprog, glfx.gl.LINK_STATUS)) {
        glfx.echo("Could not create shader program, failed to link program.");
        return null;
    }    
    
    _onPostLink(shprog);
    
    return shprog;    
};


// Textures class
glfx.textures = { };
// Textures array
glfx.textures.buffer = new Array();
// Method to load texture from file
glfx.textures.load = function(_path, _name) {

    glfx.decAssetRef();

    glfx.textures.buffer[_name] = glfx.gl.createTexture();

    var tex=glfx.textures.buffer[_name];
    tex.image = new Image();
    tex.image.onload = function() {				

        var tex = glfx.textures.buffer[_name];															
        glfx.gl.bindTexture(glfx.gl.TEXTURE_2D, tex);
        glfx.gl.pixelStorei(glfx.gl.UNPACK_FLIP_Y_WEBGL, true);
        glfx.gl.texImage2D(glfx.gl.TEXTURE_2D, 0, glfx.gl.RGBA, glfx.gl.RGBA, glfx.gl.UNSIGNED_BYTE, tex.image);

        glfx.gl.texParameteri(glfx.gl.TEXTURE_2D, glfx.gl.TEXTURE_MAG_FILTER, glfx.gl.LINEAR);
        glfx.gl.texParameteri(glfx.gl.TEXTURE_2D, glfx.gl.TEXTURE_MIN_FILTER, glfx.gl.LINEAR);

        // required for non-power-of-2 textures
        glfx.gl.texParameteri(glfx.gl.TEXTURE_2D, glfx.gl.TEXTURE_WRAP_S, glfx.gl.CLAMP_TO_EDGE);
        glfx.gl.texParameteri(glfx.gl.TEXTURE_2D, glfx.gl.TEXTURE_WRAP_T, glfx.gl.CLAMP_TO_EDGE);

        glfx.gl.bindTexture(glfx.gl.TEXTURE_2D, null);

        glfx.incAssetRef();

    }

    tex.image.src = _path;			
}


// Model class
glfx.model = function() {

    this.vertexBuffer = null;
    this.indexBuffer = null;
    this.texcoordBuffer = null;
    this.normalBuffer = null;

};

// Models class
glfx.models = { };
// Models array
glfx.models.buffer = new Array();
// Method to parse JSON model
glfx.models.jsonParser = function(_data) {   

    var data = JSON.parse(_data);
    return glfx.models.jsonLoad(data);
};

glfx.models.jsonLoad = function(_jsonData) {    

    var data = _jsonData;

    var mdl = new glfx.model();

    mdl.vertexBuffer = glfx.gl.createBuffer();
    glfx.gl.bindBuffer(glfx.gl.ARRAY_BUFFER, mdl.vertexBuffer);                        
    glfx.gl.bufferData(glfx.gl.ARRAY_BUFFER, new Float32Array(data.verts), glfx.gl.STATIC_DRAW);
    mdl.vertexBuffer.itemSize = 3;
    mdl.vertexBuffer.numItems = data.verts.length / 3;

    mdl.indexBuffer = glfx.gl.createBuffer();
    glfx.gl.bindBuffer(glfx.gl.ELEMENT_ARRAY_BUFFER, mdl.indexBuffer);
    glfx.gl.bufferData(glfx.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), glfx.gl.STATIC_DRAW);
    mdl.indexBuffer.itemSize = 1;
    mdl.indexBuffer.numItems = data.indices.length;		

    if(data.texcoords.length > 0) {
        mdl.texcoordBuffer = glfx.gl.createBuffer();
        glfx.gl.bindBuffer(glfx.gl.ARRAY_BUFFER, mdl.texcoordBuffer);                        
        glfx.gl.bufferData(glfx.gl.ARRAY_BUFFER, new Float32Array(data.texcoords), glfx.gl.STATIC_DRAW);
        mdl.texcoordBuffer.itemSize = 2;
        mdl.texcoordBuffer.numItems = data.texcoords.length / 2;			                        
    }

    if(data.normals.length > 0) {
        mdl.normalBuffer = glfx.gl.createBuffer();
        glfx.gl.bindBuffer(glfx.gl.ARRAY_BUFFER, mdl.normalBuffer);       
        glfx.gl.bufferData(glfx.gl.ARRAY_BUFFER, new Float32Array(data.normals), glfx.gl.STATIC_DRAW);
        mdl.normalBuffer.itemSize = 3;
        mdl.normalBuffer.numItems = data.normals / 3;                            
    }                
    
    return mdl;
    
};

// Method to load models from JSON file
glfx.models.load = function(_url, _name, _parser, _callback) {

    glfx.decAssetRef();

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {				
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            var mdl = _parser(xmlhttp.responseText);
            glfx.models.buffer[_name] = mdl;
            if(typeof _callback !== 'undefined') {
                _callback(mdl);
            }

            glfx.incAssetRef();
        }
    };

    xmlhttp.open("GET", _url, true);
    xmlhttp.send();                
};


glfx.models.generateScreenQuadStrip = function(_name, _callback) {
    
    var mdlJSON = {};
    mdlJSON.verts = [ -1.0,  1.0,  0.0,
                      -1.0, -1.0,  0.0,
                       1.0, -1.0,  0.0,
                       1.0,  1.0,  0.0
                      ];
                  
    mdlJSON.normals = [];
    mdlJSON.indices = [0, 1, 3, 2];
    
    mdlJSON.texcoords = [
         0.0, 1.0,
         0.0, 0.0,
         1.0, 0.0,
         1.0, 1.0
    ];
        
    glfx.models.buffer[_name] = glfx.models.jsonLoad(mdlJSON);   
};

// Scene class
glfx.scene = { };
// Scene last render time
glfx.scene.ptime = 0;
// Camera matrix
glfx.scene.matCamera = null;
// Model-View matrix
glfx.scene.matModelView = null;
// Perspective matrix
glfx.scene.matPerspective = null;
// Scene graph
glfx.scene.graph = new Array();

// Texture for Render-to-Texture
glfx.scene.rttTexture = null;

// Framebuffer for Render-to-Texture
glfx.scene.rttFramebuffer = null;

// Depth buffer for Render-to-Texture
glfx.scene.rttDepthBuffer = null;

// func to call before post-process draw
glfx.scene.onPostProcessPreDraw = function() { };

// Class for scene (world) objects
//   _base = object with vertex buffer, index buffer, texture coordinate buffer, etc.
glfx.scene.worldObject = function(_base, _shaderProgram) {
    this.base = _base;			
    this.shprog = _shaderProgram;
    this.position = vec3.create();
    this.rotation = vec3.create();
    this.scale = vec3.clone([1.0, 1.0, 1.0]);
    this.update = function() { };
    this.render = function() { };
};

/**
 * IMPORTANT: This will change
 * Need to build support for multiple scenes applying arbitruary number of post-process shaders to each scene
 */
glfx.scene.setPostProcessShaderProgram = function (_shprog) {
    glfx.rttprog = _shprog;
};

// method to add object to scene graph
glfx.scene.addWorldObject = function(_wo) {
    glfx.scene.graph.push(_wo);
};

// set field of view
glfx.setFOV = function(_fov) {
    mat4.perspective(glfx.scene.matPerspective, _fov, glfx.gl.viewportWidth / glfx.gl.viewportHeight, 0.1, 1000.0);
};

// set clear color
glfx.setClearColor = function(_color) {
    glfx.gl.clearColor(_color[0], _color[1], _color[2], _color[3]);
};


glfx.initRTTFrameBuffer = function(_width, _height) {
    
    var frameBuffer = glfx.gl.createFramebuffer();
    glfx.gl.bindFramebuffer(glfx.gl.FRAMEBUFFER, frameBuffer);
    frameBuffer.width = _width;
    frameBuffer.height = _height;
    
    return frameBuffer;
};

glfx.initRTTTexture = function(_frameBuffer) {
    
    var texture = glfx.gl.createTexture();
    glfx.gl.bindTexture(glfx.gl.TEXTURE_2D, texture);

    glfx.gl.texParameteri(glfx.gl.TEXTURE_2D, glfx.gl.TEXTURE_MAG_FILTER, glfx.gl.LINEAR);
    glfx.gl.texParameteri(glfx.gl.TEXTURE_2D, glfx.gl.TEXTURE_MIN_FILTER, glfx.gl.LINEAR);
    glfx.gl.texParameteri(glfx.gl.TEXTURE_2D, glfx.gl.TEXTURE_WRAP_S, glfx.gl.CLAMP_TO_EDGE);
    glfx.gl.texParameteri(glfx.gl.TEXTURE_2D, glfx.gl.TEXTURE_WRAP_T, glfx.gl.CLAMP_TO_EDGE);
    
    glfx.gl.texImage2D(glfx.gl.TEXTURE_2D, 0, glfx.gl.RGBA, _frameBuffer.width, _frameBuffer.height, 0, glfx.gl.RGBA, glfx.gl.UNSIGNED_BYTE, null);
    
    glfx.gl.bindTexture(glfx.gl.TEXTURE_2D, null);
    
    return texture;
};

glfx.initRTTDepthBuffer = function(_frameBuffer) {
  
    var depthBuffer = glfx.gl.createRenderbuffer();
    glfx.gl.bindRenderbuffer(glfx.gl.RENDERBUFFER, depthBuffer);
    glfx.gl.renderbufferStorage(glfx.gl.RENDERBUFFER, glfx.gl.DEPTH_COMPONENT16, _frameBuffer.width, _frameBuffer.height);

    return depthBuffer;        
};

// Initialization function
//   _canvas = DOM canvas element
//   _onInitComplete (optional) = callback after init is complete
glfx.init = function(_canvas, _canvasWidthCSSPx, _canvasHeightCSSPx, _onInitComplete) {

    glfx.gl = _canvas.getContext("experimental-webgl", {antialias:true});
    if (!glfx.gl) {
        glfx.echo("No webGL support.");
        return false;
    }
	
    // Set the width,height styles of the canvas (in CSS pixels)
    _canvas.style.width = _canvasWidthCSSPx + 'px';
    _canvas.style.height = _canvasHeightCSSPx + 'px';

    // Set the width,height attributes of the canvas element (in device pixels)
    var _canvasWidthDevicePx = _canvasWidthCSSPx * glfx.devicePixelRatio;
    var _canvasHeightDevicePx = _canvasHeightCSSPx * glfx.devicePixelRatio;	
    _canvas.setAttribute("width", _canvasWidthDevicePx);
    _canvas.setAttribute("height", _canvasHeightDevicePx);
	
    // Set viewport width,height based on dimensions of canvas element		
    glfx.gl.viewportWidth = _canvasWidthDevicePx;
    glfx.gl.viewportHeight = _canvasHeightDevicePx;		

    // Set clear color
    glfx.setClearColor([1,1,1,1]);

    // Enable depth buffer
    glfx.gl.enable(glfx.gl.DEPTH_TEST);				

    // Setup scene matrices
    glfx.scene.matPerspective = mat4.create();
    glfx.scene.matModelView = mat4.create();			
    glfx.scene.matCamera = mat4.create();	
    glfx.setFOV(1.57079633);
    
    // Setup RTT
    glfx.scene.rttFramebuffer = glfx.initRTTFrameBuffer(glfx.gl.viewportWidth, glfx.gl.viewportHeight);
    glfx.scene.rttTexture = glfx.initRTTTexture(glfx.scene.rttFramebuffer);
    glfx.scene.rttDepthBuffer = glfx.initRTTDepthBuffer(glfx.scene.rttFramebuffer);
    glfx.gl.framebufferTexture2D(glfx.gl.FRAMEBUFFER, glfx.gl.COLOR_ATTACHMENT0, glfx.gl.TEXTURE_2D, glfx.scene.rttTexture, 0);
    glfx.gl.framebufferRenderbuffer(glfx.gl.FRAMEBUFFER, glfx.gl.DEPTH_ATTACHMENT, glfx.gl.RENDERBUFFER, glfx.scene.rttDepthBuffer);
    
    glfx.models.generateScreenQuadStrip("rttquad");

    // Reset
    glfx.gl.bindTexture(glfx.gl.TEXTURE_2D, null);
    glfx.gl.bindRenderbuffer(glfx.gl.RENDERBUFFER, null);
    glfx.gl.bindFramebuffer(glfx.gl.FRAMEBUFFER, null);

    // Execute callback if one was passed
    if(typeof _onInitComplete !== 'undefined') {
        _onInitComplete();
    }

    // Begin rendering
    glfx.render(0);

    return true;
};

glfx.resetCamera = function() {
    glfx.scene.matCamera = mat4.create();    
};

glfx.translateCamera = function(_translateVector) {    
    mat4.translate(glfx.scene.matCamera, glfx.scene.matCamera, _translateVector);    
};

glfx.rotateCamera = function(_angle, _axis) {
    mat4.rotate(glfx.scene.matCamera, glfx.scene.matCamera, _angle, _axis);	
};

glfx.renderToFrameBuffer = function(_frameBuffer, _tdelta) {
    
    // Reset framebuffer
    glfx.gl.bindFramebuffer(glfx.gl.FRAMEBUFFER, _frameBuffer);		

    // Clear viewport
    glfx.gl.viewport(0, 0, glfx.gl.viewportWidth, glfx.gl.viewportHeight);
    glfx.gl.clear(glfx.gl.COLOR_BUFFER_BIT | glfx.gl.DEPTH_BUFFER_BIT);					

    // Render all models in scene
    for(var i=0; i<glfx.scene.graph.length; i++) {                   

        glfx.scene.matModelView = mat4.create();	
        mat4.multiply(glfx.scene.matModelView, glfx.scene.matModelView, glfx.scene.matCamera); 

        glfx.scene.graph[i].update(_tdelta, glfx.scene.graph[i]);

        if (glfx.scene.graph[i].matTransform) {
            mat4.multiply(glfx.scene.matModelView, glfx.scene.matModelView, glfx.scene.graph[i].matTransform);
        } else {

            var objpos = glfx.scene.graph[i].position;
            var objrot = glfx.scene.graph[i].rotation;
            var objscale = glfx.scene.graph[i].scale;

            mat4.scale(glfx.scene.matModelView, glfx.scene.matModelView, objscale);
            mat4.translate(glfx.scene.matModelView, glfx.scene.matModelView, objpos);
            mat4.rotate(glfx.scene.matModelView, glfx.scene.matModelView, objrot[0], [1, 0, 0]);
            mat4.rotate(glfx.scene.matModelView, glfx.scene.matModelView, objrot[1], [0, 1, 0]);
            mat4.rotate(glfx.scene.matModelView, glfx.scene.matModelView, objrot[2], [0, 0, 1]);

        }

        glfx.scene.graph[i].render(_tdelta, glfx.scene.graph[i], glfx.scene.matModelView, glfx.scene.matPerspective);
    }
};

// Render loop function
glfx.render = function(_time) {

    requestAnimationFrame(glfx.render);
    if(glfx.assetRef < 0) {
        return;
    }

    // Calculate frame time delta
    var tdelta = 0;
    if(glfx.scene.ptime > 0) {
        tdelta = _time - glfx.scene.ptime;
    }	
    glfx.scene.ptime = _time;

    if(glfx.rttprog === null) {
        glfx.renderToFrameBuffer(null, tdelta);
    } else {
        glfx.renderToFrameBuffer(glfx.scene.rttFramebuffer, tdelta);
        glfx.renderViewportQuad(glfx.scene.rttTexture, glfx.rttprog, tdelta);
    }
   
    glfx.onSceneRender(tdelta);
};

glfx.renderViewportQuad = function (_texture, _shaderProgram, _tdelta) {

    if(_shaderProgram === null) {
        glfx.echo('glfx.renderViewportQuad failed, _shaderProgram is null');
        return false;
    }

    if(_texture === null) {
        glfx.echo('glfx.renderViewportQuad failed, _texture is null');
        return false;
    }

    glfx.gl.bindFramebuffer(glfx.gl.FRAMEBUFFER, null);		
    glfx.gl.viewport(0, 0, glfx.gl.viewportWidth, glfx.gl.viewportHeight);
    glfx.gl.clear(glfx.gl.COLOR_BUFFER_BIT | glfx.gl.DEPTH_BUFFER_BIT);	       
        
    var renderToQuad = glfx.models.buffer["rttquad"];

    var pMatrix = mat4.create();
    mat4.ortho(pMatrix, -1, 1, -1, 1, 0.1, -100);
    
    var mvMatrix = mat4.create();    
    mat4.lookAt(mvMatrix, vec3.clone([0, 0, 0]), vec3.clone([0, 0, -1]), vec3.clone([0, 1, 0]));
 
    glfx.gl.useProgram(_shaderProgram);
  
    glfx.gl.activeTexture(glfx.gl.TEXTURE0);
    glfx.gl.bindTexture(glfx.gl.TEXTURE_2D, _texture);
    glfx.gl.uniform1i(_shaderProgram.samplerUniform, 0);

    glfx.gl.bindBuffer(glfx.gl.ARRAY_BUFFER, renderToQuad.vertexBuffer);
    glfx.gl.vertexAttribPointer(_shaderProgram.vertexPositionAttribute, renderToQuad.vertexBuffer.itemSize, glfx.gl.FLOAT, false, 0, 0);

    glfx.gl.bindBuffer(glfx.gl.ARRAY_BUFFER, renderToQuad.texcoordBuffer);
    glfx.gl.vertexAttribPointer(_shaderProgram.textureCoordAttribute, renderToQuad.texcoordBuffer.itemSize, glfx.gl.FLOAT, false, 0, 0);
    
    glfx.gl.uniformMatrix4fv(_shaderProgram.pMatrixUniform, false, pMatrix);
    glfx.gl.uniformMatrix4fv(_shaderProgram.mvMatrixUniform, false, mvMatrix);
    
    glfx.gl.bindBuffer(glfx.gl.ELEMENT_ARRAY_BUFFER, renderToQuad.indexBuffer);

    glfx.scene.onPostProcessPreDraw(_tdelta);

    glfx.gl.drawElements(glfx.gl.TRIANGLE_STRIP, renderToQuad.indexBuffer.numItems, glfx.gl.UNSIGNED_SHORT, 0);	 

    return true;
};