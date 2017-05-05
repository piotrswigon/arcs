/**
 * @license
 * Copyright (c) 2017 Google Inc. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
"use strict";

var runtime = require("./runtime.js");
var assert = require("assert");
var tracing = require("tracelib");
const Type = require('./type.js');
const view = require('./view.js');
const Relation = require('./relation.js');
let viewlet = require('./viewlet.js');
const InnerPEC = require('./inner-PEC.js');
const MessageChannel = require('./message-channel.js');
const OuterPEC = require('./outer-PEC.js');

class Arc {
  constructor(scope, id) {
    assert(scope instanceof runtime.Scope, "Arc constructor requires a scope");
    this.scope = scope;
    this.id = id;
    this.nextLocalID = 0;
    this.particles = [];
    this.views = new Set();
    this._viewsByType = new Map();
    this.particleViewMaps = new Map();
    var channel = new MessageChannel();
    this.pec = new OuterPEC(scope, channel.port2, this.generateID());
    this._innerPEC = new InnerPEC(channel.port1, this.generateID());
    this.nextParticleHandle = 0;
  }

  generateID() {
    return `${this.id}:${this.nextLocalID++}`;
  }

  clone() {
    var arc = new Arc(this.scope.clone());
    var viewMap = new Map();
    this.views.forEach(v => viewMap.set(v, v.clone()));
    arc.particles = this.particles.map(p => p.clone(viewMap));
    for (let v of viewMap.values())
      arc.registerView(v);
    arc._viewMap = viewMap;
    return arc;
  }

  connectParticleToView(particle, name, targetView) {
    // If speculatively executing then we need to translate the view
    // in the plan to its clone.
    if (this._viewMap) {
      targetView = this._viewMap.get(targetView);
    }
    assert(this.views.has(targetView), "view of type " + targetView.type.key + " not visible to arc");
    var viewMap = this.particleViewMaps.get(particle);
    assert(viewMap.clazz.spec.connectionMap.get(name) !== undefined, "can't connect view to a view slot that doesn't exist");
    viewMap.views.set(name, targetView);
    if (viewMap.views.size == viewMap.clazz.spec.connectionMap.size) {
      var particle = this.pec.instantiate(viewMap.clazz, viewMap.views)
      this.particles.push(particle);
    } 
  }

  constructParticle(particleClass) {
    var handle = this.nextParticleHandle++;
    this.particleViewMaps.set(handle, {clazz: particleClass, views: new Map()});
    return handle;
  }
 
  createView(type, name) {
    assert(type instanceof Type, "can't createView with a type that isn't a Type");
    if (type.isRelation)
      type = type.viewOf(this);
    if (type.isView) {
      var v = new view.View(type, this, name);
    } else {
      var v = new view.Variable(type, this, name);
    }
    this.registerView(v);
    return v;
  }

  registerView(view) {
    let views = this.findViews(view.type);
    if (!views.length) {
      this._viewsByType.set(view.type, views);
    }
    views.push(view);

    this.addView(view);
  }

  findViews(type, options) {
    // TODO: use options (location, labels, etc.) somehow.
    return this._viewsByType.get(type) || [];
  }

  addView(view) {
    view.arc = this;
    this.views.add(view);
  }

  _viewFor(type) {
    let views = this.findViews(type);
    if (views.length > 0) {
      return views[0];
    }

    return this.createView(type, "automatically created for _viewFor");
  }

  commit(entities) {
    let entityMap = new Map();
    for (let entity of entities) {
      entityMap.set(entity, this._viewFor(this.scope.typeFor(entity).viewOf(this.scope)));
    }
    for (let entity of entities) {
      if (entity instanceof Relation) {
        entity.entities.forEach(entity => entityMap.set(entity, this._viewFor(this.scope.typeFor(entity).viewOf(this.scope))));
      }
    }
    this.newCommit(entityMap);
  }

  newCommit(entityMap) {
    for (let [entity, view] of entityMap.entries()) {
      entity.identify(this.generateID());
    }
    for (let [entity, view] of entityMap.entries()) {
      new viewlet.viewletFor(view).store(entity);
    }
  }  
}

module.exports = Arc;
