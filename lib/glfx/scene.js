// Prototypical scene object
glfx.scene = {

    // Scene last render time
    ptime: null,

    // World objects
    worldObjects: null,

    getWorldObjects: function() {
        return this.worldObjects;
    },

    // Screen objects
    screenObjects: null,

    getScreenObjects: function() {
        return this.screenObjects;
    },

    // Camera matrix
    matCamera: null,

    // Model-View matrix
    matModelView: null,

    // Perspective matrix
    matPerspective: null,

    // Texture for Render-to-Texture
    rttTexture: null,

    // Framebuffer for Render-to-Texture
    rttFramebuffer: null,

    // Depth buffer for Render-to-Texture
    rttDepthBuffer: null,

    init: function() {

        this.ptime = 0;
        this.worldObjects = [];
        this.screenObjects = [];

        this.matPerspective = mat4.create();
        this.matModelView = mat4.create();
        this.matCamera = mat4.create();
        this.setFOV(1.57079633);

        return this;
    },

    setupRenderToTexture: function() {

        // Setup RTT
        this.rttFramebuffer = glfx.initRTTFrameBuffer(glfx.gl.viewportWidth, glfx.gl.viewportHeight);
        this.rttTexture = glfx.initRTTTexture(this.rttFramebuffer);
        this.rttDepthBuffer = glfx.initRTTDepthBuffer(this.rttFramebuffer);
        glfx.gl.framebufferTexture2D(glfx.gl.FRAMEBUFFER, glfx.gl.COLOR_ATTACHMENT0, glfx.gl.TEXTURE_2D, this.rttTexture, 0);
        glfx.gl.framebufferRenderbuffer(glfx.gl.FRAMEBUFFER, glfx.gl.DEPTH_ATTACHMENT, glfx.gl.RENDERBUFFER, this.rttDepthBuffer);

    },

    // method to add object to scene graph
    addWorldObject: function(_wo) {
        this.worldObjects.push(_wo);
    },

    addScreenObject: function(_so) {
        this.screenObjects.push(_so);
    },

    // set field of view
    setFOV: function(_fov) {
        mat4.perspective(this.matPerspective, _fov, glfx.gl.viewportWidth / glfx.gl.viewportHeight, 0.1, 1000.0);
    },

    resetCamera: function() {
        this.matCamera = mat4.create();
    },

    translateCamera: function(_translateVector) {
        mat4.translate(this.matCamera, this.matCamera, _translateVector);
    },

    rotateCamera: function(_angle, _axis) {
        mat4.rotate(this.matCamera, this.matCamera, _angle, _axis);
    },

    _renderWorldObjects: function(_tdelta) {

        // Render world objects
        var worldObjects = this.getWorldObjects();
        for(var i=0; i<worldObjects.length; i++) {

            this.matModelView = mat4.create();
            mat4.multiply(this.matModelView, this.matModelView, this.matCamera);

            worldObjects[i].update(_tdelta, worldObjects[i]);

            if (worldObjects[i].matTransform) {
                mat4.multiply(this.matModelView, this.matModelView, worldObjects[i].matTransform);
            } else {

                var objpos = worldObjects[i].position;
                var objrot = worldObjects[i].rotation;
                var objscale = worldObjects[i].scale;

                mat4.scale(this.matModelView, this.matModelView, objscale);
                mat4.translate(this.matModelView, this.matModelView, objpos);
                mat4.rotate(this.matModelView, this.matModelView, objrot[0], [1, 0, 0]);
                mat4.rotate(this.matModelView, this.matModelView, objrot[1], [0, 1, 0]);
                mat4.rotate(this.matModelView, this.matModelView, objrot[2], [0, 0, 1]);

            }

            worldObjects[i].render(_tdelta, worldObjects[i], this.matModelView, this.matPerspective);
        }
    },


    _renderScreenObjects: function(_tdelta) {

        var pMatrix = mat4.create();
        mat4.ortho(pMatrix, -1, 1, -1, 1, 0.1, -100);

        var mvMatrix = mat4.create();
        mat4.lookAt(mvMatrix, vec3.clone([0, 0, 0]), vec3.clone([0, 0, -1]), vec3.clone([0, 1, 0]));

        // Render world objects
        var screenObjects = this.getScreenObjects();
        for(var i=0; i<screenObjects.length; i++) {

            screenObjects[i].update(_tdelta, screenObjects[i]);
            mat4.multiply(mvMatrix, mvMatrix, screenObjects[i].matTransform);

            screenObjects[i].render(_tdelta, screenObjects[i], mvMatrix, pMatrix);
        }
    },

    render: function(_time) {
        // Calculate frame time delta
        var tdelta = 0;
        if(this.ptime > 0) {
            tdelta = _time - this.ptime;
        }
        this.ptime = _time;

        // Reset framebuffer
        glfx.gl.bindFramebuffer(glfx.gl.FRAMEBUFFER, this.rttFramebuffer);

        // Clear viewport
        glfx.gl.viewport(0, 0, glfx.gl.viewportWidth, glfx.gl.viewportHeight);
        glfx.gl.clear(glfx.gl.COLOR_BUFFER_BIT | glfx.gl.DEPTH_BUFFER_BIT);

        this._renderWorldObjects(tdelta);
        this._renderScreenObjects(tdelta);

        return this.rttTexture;
    },
    
    renderViewportScene: function(_time, _texture) {

        // Calculate frame time delta
        var tdelta = 0;
        if(this.ptime > 0) {
            tdelta = _time - this.ptime;
        }
        this.ptime = _time;
        
        glfx.renderViewportQuad(this, _texture, glfx.rttprog, tdelta);
    }

};

// Prototypical world object
glfx.scene.worldObject = {

    base: null,
    shprog: null,
    position: null,
    rotation: null,
    scale: null,
    update: function() { },
    render: function() { },

    init: function(_model, _shaderProgram) {
        this.base = _model;
        this.shprog = _shaderProgram;
        this.position = vec3.create();
        this.rotation = vec3.create();
        this.scale = vec3.clone([1.0, 1.0, 1.0]);
    },

};

// Prototypical screen object
glfx.scene.screenObject = {

    base: null,
    shprog: null,
    position: null,
    rotation: null,
    scale: null,
    matTransform: null,
    update: function() { },
    render: function() { },

    init: function(_model, _shaderProgram) {
        this.base = _model;
        this.shprog = _shaderProgram;
        this.position = vec3.create();
        this.rotation = vec3.create();
        this.scale = vec3.clone([1.0, 1.0, 1.0]);
        this.matTransform = mat4.create();
    },

};