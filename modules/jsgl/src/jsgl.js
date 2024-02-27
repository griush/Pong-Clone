// vec2 start
function vec2(x, y) {
  return { x: x, y: y }
}

function vec2Add(a_vec, b_vec) {
  return vec2(a_vec.x + b_vec.x, a_vec.y + b_vec.y)
}

function vec2Neg(vec) {
  return vec2(-vec.x, -vec.y)
}

function vec2Scale(vec, scalar) {
  return vec2(vec.x * scalar, vec.y * scalar)
}

function vec2Maginitude(vec) {
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y)
}

function vec2Distance(a_vec, b_vec) {
  return vec2Maginitude(vec2Add(a_vec, vec2Neg(b_vec)))
}

function vec2Normailze(vec) {
  const mag = vec2Maginitude(vec)
  return vec2(vec.x / mag, vec.y / mag)
}
// vec2 end

// rand start
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

function randFloat(min, max) {
  return Math.random() * (max - min) + min
}

function randChoose(a, b) {
  if (randInt(0, 100) % 2 == 0) {
    return a
  }
  
  return b
}
// rand end

// draw start
function createQuadData(pos_vec, half_size_vec, color, ctx) {
  return {
    pos: pos_vec,
    size: half_size_vec,
    color: color,
    ctx: ctx,
  }
}

function drawQuad(data) {
  data.ctx.fillStyle = data.color
  data.ctx.fillRect(data.pos.x - data.size.x, data.pos.y - data.size.y, data.size.x * 2, data.size.y * 2)
}
// draw end

// collision start
/// Function is inclusive (if they point is in the border and not in, returns true)
/// Top-left is (0,0) assumed
function pointInQuad(p_vec, data) {
  return p_vec.x <= data.pos.x + data.size.x &&
    p_vec.x >= data.pos.x - data.size.x &&
    p_vec.y >= data.pos.y - data.size.y &&
    p_vec.y <= data.pos.y + data.size.y;
}

function quadInQuad(data1, data2) {
  const tl = vec2(data1.pos.x - data1.size.x, data1.pos.y - data1.size.y)
  const tr = vec2(data1.pos.x + data1.size.x, data1.pos.y - data1.size.y)
  const bl = vec2(data1.pos.x - data1.size.x, data1.pos.y + data1.size.y)
  const br = vec2(data1.pos.x + data1.size.x, data1.pos.y + data1.size.y)
  return pointInQuad(tl, data2) || pointInQuad(tr, data2) || pointInQuad(bl, data2) || pointInQuad(br, data2)
}
// collision end

export {
  vec2,
  vec2Add,
  vec2Neg,
  vec2Scale,
  vec2Maginitude,
  vec2Distance,
  vec2Normailze,

  randInt,
  randFloat,
  randChoose,

  createQuadData,
  drawQuad,

  pointInQuad,
  quadInQuad,
}