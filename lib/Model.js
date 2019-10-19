const Model = function() {
    this.vertexBuffer = null;
    this.indexBuffer = null;
    this.texcoordBuffer = null;
    this.normalBuffer = null;
};

Model.createScreenQuadStrip = function(_gl) {
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
        
    return Model.fromJson(_gl, mdlJSON);   
};

Model.fromJson = function(_gl, _jsonData) {
    const mdl = new Model();

    mdl.vertexBuffer = _gl.createBuffer();
    _gl.bindBuffer(_gl.ARRAY_BUFFER, mdl.vertexBuffer);                        
    _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(_jsonData.verts), _gl.STATIC_DRAW);
    mdl.vertexBuffer.itemSize = 3;
    mdl.vertexBuffer.numItems = _jsonData.verts.length / 3;

    mdl.indexBuffer = _gl.createBuffer();
    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, mdl.indexBuffer);
    _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(_jsonData.indices), _gl.STATIC_DRAW);
    mdl.indexBuffer.itemSize = 1;
    mdl.indexBuffer.numItems = _jsonData.indices.length;		

    if(_jsonData.texcoords.length > 0) {
        mdl.texcoordBuffer = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, mdl.texcoordBuffer);                        
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(_jsonData.texcoords), _gl.STATIC_DRAW);
        mdl.texcoordBuffer.itemSize = 2;
        mdl.texcoordBuffer.numItems = _jsonData.texcoords.length / 2;			                        
    }

    if(_jsonData.normals.length > 0) {
        mdl.normalBuffer = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, mdl.normalBuffer);       
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(_jsonData.normals), _gl.STATIC_DRAW);
        mdl.normalBuffer.itemSize = 3;
        mdl.normalBuffer.numItems = _jsonData.normals / 3;                            
    }                
    
    return mdl;
};


export { Model }
