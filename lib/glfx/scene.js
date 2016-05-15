// Prototypical scene object
glfx.scene = {

    // Scene last render time
    ptime: null,

    // Scene graph
    graph: null,

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
        this.graph = [];

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

    // func to call before post-process draw
    onPostProcessPreDraw: function() { },

    setPostProcessShaderProgram: function (_shprog) {
        glfx.rttprog = _shprog;
    },

    // method to add object to scene graph
    addWorldObject: function(_wo) {
        this.graph.push(_wo);
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

    render: function(_time) {
        // Calculate frame time delta
        var tdelta = 0;
        if(this.ptime > 0) {
            tdelta = _time - this.ptime;
        }
        this.ptime = _time;

        glfx.renderToFrameBuffer(this, this.rttFramebuffer, tdelta);

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
//   _base = object with vertex buffer, index buffer, texture coordinate buffer, etc.
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