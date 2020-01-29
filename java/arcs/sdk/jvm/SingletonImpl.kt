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
import kotlinx.coroutines.channels.*

/** [ReadWriteSingleton] implementation for the JVM. */
@Suppress("UNUSED_PARAMETER")
// TODO: Connect to storage.
class SingletonImpl<T : Entity>(
    private val particle: Particle,
    override val name: String,
    entitySpec: EntitySpec<T>
) : ReadWriteSingleton<T> {

    val updatesChannel = BroadcastChannel<T?>(10)

    private var entity: T? = null

    override fun get(): T? = entity

    override fun set(entity: T) {
        this.entity = entity
        updatesChannel.offer(entity)
        particle.onHandleUpdate(this)
    }

    override fun clear() {
        this.entity = null
        updatesChannel.offer(null)
        particle.onHandleUpdate(this)
    }

    override val updates: Flow<T?>
            get() = updatesChannel.asFlow()
}
