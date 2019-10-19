/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create() {
  var out = new ARRAY_TYPE(16);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */

function multiply(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]; // Cache only the current line of the second matrix

  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */

function translate(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/

function scale(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function rotate(out, a, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;

  if (len < EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11]; // Construct the elements of the rotation matrix

  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  return out;
}
/**
 * Generates a perspective projection matrix with the given bounds.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspective(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }

  return out;
}
/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function ortho(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */

function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];

  if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
    return identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.hypot(x0, x1, x2);

  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.hypot(y0, y1, y2);

  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}

// glfx object wraps everything necessary for the rendering interface
var glfx = { };

glfx.version = '0.3.1';

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

    };

    tex.image.src = _path;			
};


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
    perspective(glfx.scene.matPerspective, _fov, glfx.gl.viewportWidth / glfx.gl.viewportHeight, 0.1, 1000.0);
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
    glfx.scene.matPerspective = create();
    glfx.scene.matModelView = create();			
    glfx.scene.matCamera = create();	
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
    glfx.scene.matCamera = create();    
};

glfx.translateCamera = function(_translateVector) {    
    translate(glfx.scene.matCamera, glfx.scene.matCamera, _translateVector);    
};

glfx.rotateCamera = function(_angle, _axis) {
    rotate(glfx.scene.matCamera, glfx.scene.matCamera, _angle, _axis);	
};

glfx.renderToFrameBuffer = function(_frameBuffer, _tdelta) {
    
    // Reset framebuffer
    glfx.gl.bindFramebuffer(glfx.gl.FRAMEBUFFER, _frameBuffer);		

    // Clear viewport
    glfx.gl.viewport(0, 0, glfx.gl.viewportWidth, glfx.gl.viewportHeight);
    glfx.gl.clear(glfx.gl.COLOR_BUFFER_BIT | glfx.gl.DEPTH_BUFFER_BIT);					

    // Render all models in scene
    for(var i=0; i<glfx.scene.graph.length; i++) {                   

        glfx.scene.matModelView = create();	
        multiply(glfx.scene.matModelView, glfx.scene.matModelView, glfx.scene.matCamera); 

        glfx.scene.graph[i].update(_tdelta, glfx.scene.graph[i]);

        if (glfx.scene.graph[i].matTransform) {
            multiply(glfx.scene.matModelView, glfx.scene.matModelView, glfx.scene.graph[i].matTransform);
        } else {

            var objpos = glfx.scene.graph[i].position;
            var objrot = glfx.scene.graph[i].rotation;
            var objscale = glfx.scene.graph[i].scale;

            scale(glfx.scene.matModelView, glfx.scene.matModelView, objscale);
            translate(glfx.scene.matModelView, glfx.scene.matModelView, objpos);
            rotate(glfx.scene.matModelView, glfx.scene.matModelView, objrot[0], [1, 0, 0]);
            rotate(glfx.scene.matModelView, glfx.scene.matModelView, objrot[1], [0, 1, 0]);
            rotate(glfx.scene.matModelView, glfx.scene.matModelView, objrot[2], [0, 0, 1]);

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

    var pMatrix = create();
    ortho(pMatrix, -1, 1, -1, 1, 0.1, -100);
    
    var mvMatrix = create();    
    lookAt(mvMatrix, vec3.clone([0, 0, 0]), vec3.clone([0, 0, -1]), vec3.clone([0, 1, 0]));
 
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

export { glfx };
