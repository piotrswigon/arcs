/*
 * Copyright 2020 Google LLC.
 *
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 *
 * Code distributed by Google as part of this project is also subject to an additional IP rights
 * grant found at
 * http://polymer.github.io/PATENTS.txt
 */

package arcs.sdk
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.*

/** Implementation of [Particle] for the JVM. */
abstract class BaseParticle : Particle {
    val coroutineContext = Dispatchers.IO + CoroutineName("Particle")
    val particleScope = CoroutineScope(coroutineContext)

    init {
        particleScope.launch {}
    }

    // Same for tuples with more args
    fun <A, B> reactTo(a: Flow<A>, b: Flow<B>, action: suspend (A, B) -> Unit) {
        a.combine(b) {i1, i2 -> i1 to i2}
                .onEach {(a, b) -> action(a, b)}
                .launchIn(particleScope)
    }
}
