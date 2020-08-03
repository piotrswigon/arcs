/**
 * @license
 * Copyright 2020 Google LLC.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * Code distributed by Google as part of this project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import {PlanGenerator} from '../plan-generator.js';
import {assert} from '../../platform/chai-node.js';
import {Manifest} from '../../runtime/manifest.js';
import {AllocatorRecipeResolver} from '../allocator-recipe-resolver.js';
import {Recipe} from '../../runtime/recipe/recipe.js';
import {IngressValidation} from '../../runtime/policy/ingress-validation.js';
import {Loader} from '../../platform/loader.js';

describe('plan generator', () => {
  it('imports arcs.core.data when the package is different', () => {
    const generator = new PlanGenerator([], 'some.package');

    const actual = generator.fileHeader();

    assert.include(actual, 'import arcs.core.data.*');
  });
  it('does not import arcs.core.data when the package is the same', () => {
    const generator = new PlanGenerator([], 'arcs.core.data');

    const actual = generator.fileHeader();

    assert.notInclude(actual, 'import arcs.core.data.*');
  });

  it('restricts handle types according to policies', async () => {
    const schemaString = `
schema Thing
  a: Text
  b: Text
  c: Text
    `;
    const policiesManifest = `
${schemaString}
policy Policy0 {
  @allowedRetention(medium: 'Ram', encryption: false)
  @maxAge('10d')
  from Thing access { a }
}
policy Policy1 {
  @allowedRetention(medium: 'Ram', encryption: false)
  @maxAge('10d')
  from Thing access { b }
}
    `;
    const {generator, recipes} = await process(`
${schemaString}
particle Writer
  things: writes [Thing {a, b, c}]
recipe ThingWriter
  handle0: create 'my-things' @ttl('3d')
  Writer
    things: handle0
    `, policiesManifest);
    const handle = recipes[0].handles[0];
    assert.deepEqual(Object.keys(handle.type.getEntitySchema().fields), ['a', 'b', 'c']);

    // Verify field `c` is dropped, because it is not allowed by the policies.
    const handleObject = await generator.createHandleVariable(handle);
    assert.equal(handleObject, `\
val ThingWriter_Handle0 = Handle(
    StorageKeyParser.parse("create://my-things"),
    arcs.core.data.CollectionType(
        arcs.core.data.EntityType(
            arcs.core.data.Schema(
                setOf(arcs.core.data.SchemaName("Thing")),
                arcs.core.data.SchemaFields(
                    singletons = mapOf(
                        "a" to arcs.core.data.FieldType.Text,
                        "b" to arcs.core.data.FieldType.Text
                    ),
                    collections = emptyMap()
                ),
                "451b4c23ec9bf2d1973079fd0732539297806b3c",
                refinementExpression = true.asExpr(),
                queryExpression = true.asExpr()
            )
        )
    ),
    listOf(Annotation("ttl", mapOf("value" to AnnotationParam.Str("3d"))))
)`);
  });
  it('fully qualifies particle schemas when in different package name', async () => {
    const loader = new Loader(null, {
      '/particle.arcs': `
        meta
          namespace: foo.bar

        particle ParticleFoo in '.ParticleFoo'
          foo: writes Person {name: Text}
      `,
      '/recipe.arcs': `
        meta
          namespace: baz.foo
        import './particle.arcs'

        recipe R
          h: create
          ParticleFoo
            foo: h
      `,
    });

    const {generator, recipes} = await processManifest(await Manifest.load('/recipe.arcs', loader));

    assert.deepStrictEqual(
      await generator.createParticle(recipes[0].particles[0]),
      `\
Particle(
    "ParticleFoo",
    "foo.bar.ParticleFoo",
    mapOf(
        "foo" to HandleConnection(
            R_Handle0,
            HandleMode.Write,
            arcs.core.data.SingletonType(arcs.core.data.EntityType(foo.bar.ParticleFoo_Foo.SCHEMA)),
            emptyList()
        )
    )
)`
    );
  });

  it.only('checking if invalid recipe can be produced', async () => {
    const schemaString = `
schema X
  a: Text
  b: Text
  c: Text
schema Y
  y: Text
    `;
    const policiesManifest = `
${schemaString}
policy Policy0 {
  @allowedRetention(medium: 'Ram', encryption: false)
  @maxAge('10d')
  from X access { a, b}
}
policy Policy1 {
  @allowedRetention(medium: 'Ram', encryption: false)
  @maxAge('10d')
  from Y access { y }
}
    `;
    const {generator, recipes} = await process(`
${schemaString}
particle Writer
  x: writes [X {a, b, c}]
particle ReadWrite
  x: reads [X {a, c}]
  y: writes [Y {y}]
recipe DoStuff
  x: create 'my-x' @ttl('3d')
  y: create 'my-y' @ttl('3d')
  Writer
    x: x
  ReadWrite
    x: x
    y: y
    
    `, policiesManifest);
    const handle = recipes[0].handles.find(h => h.id === 'my-x');
    const handleObject = await generator.createHandleVariable(handle);
    // ***
    // Type sytem would allow the type of the handle to be between:
    //   X {a, b, c} and X {a, c}, i.e. between the written and read type.
    // On its own, we would pick the smaller type, i.e. X {a, c}.
    // The ingress redacting however removes the 'c' field from the type
    // as it's not allowed by the policies and we end of with X {a} only,
    // and therefore generate a recipe that's invalid according to the
    // type system.
    // ***
    assert.equal(handleObject, `\
val DoStuff_Handle0 = Handle(
    StorageKeyParser.parse("create://my-x"),
    arcs.core.data.CollectionType(
        arcs.core.data.EntityType(
            arcs.core.data.Schema(
                setOf(arcs.core.data.SchemaName("X")),
                arcs.core.data.SchemaFields(
                    singletons = mapOf("a" to arcs.core.data.FieldType.Text),
                    collections = emptyMap()
                ),
                "eb8597be8b72862d5580f567ab563cefe192508d",
                refinementExpression = true.asExpr(),
                queryExpression = true.asExpr()
            )
        )
    ),
    listOf(Annotation("ttl", mapOf("value" to AnnotationParam.Str("3d"))))
)`);
  });

  async function process(manifestString: string, policiesManifestString?: string): Promise<{
    recipes: Recipe[],
    generator: PlanGenerator,
    plan: string
  }> {
    return processManifest(await Manifest.parse(manifestString), policiesManifestString);
  }

  async function processManifest(manifest: Manifest, policiesManifestString?: string): Promise<{
      recipes: Recipe[],
      generator: PlanGenerator,
      plan: string
  }> {
    const ingressValidation = policiesManifestString
        ? new IngressValidation((await Manifest.parse(policiesManifestString)).policies) : null;
    const recipes = await new AllocatorRecipeResolver(manifest, 'random_salt').resolve();
    const generator = new PlanGenerator(recipes, manifest.meta.namespace || 'test.namespace', ingressValidation);
    const plan = await generator.generate();
    return {recipes, generator, plan};
  }
});
